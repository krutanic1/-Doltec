const Property = require('../models/Property');
const slugify = require('slugify');
const cloudinary = require("../middleware/cloudinary");

exports.getProperties = async (req, res) => {
  try {
    const { 
      city, q, minPrice, maxPrice,
      intent, segment, propertyType, bhk, 
      possession, age, postedBy, amenities, 
      furnishing, facing, parking, availability 
    } = req.query;

    const query = { status: { $ne: 'REJECTED' } };

    // Search and Location
    if (city) query['city'] = { $regex: city, $options: 'i' };
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { locality: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Price Range
    if (minPrice || maxPrice) {
      query['price'] = {};
      if (minPrice) query['price'].$gte = Number(minPrice);
      if (maxPrice) query['price'].$lte = Number(maxPrice);
    }

    // Structured Filters (AND logic with support for old and new schema)
    const andConditions = [];

    if (intent) {
      andConditions.push({ $or: [{ 'filters.intent': intent }, { intent: intent }] });
    }
    if (segment) {
      andConditions.push({ $or: [{ 'filters.segment': segment }, { segment: segment }, { category: segment }] });
    }
    if (propertyType) {
      andConditions.push({ $or: [{ 'filters.propertyType': propertyType }, { propertyType: propertyType }] });
    }
    if (bhk) {
      const bhkDigit = bhk.split('_')[0]; // Convert '3_BHK' to '3'
      andConditions.push({ $or: [{ 'filters.bhk': bhk }, { 'features.bhk': bhkDigit }, { 'features.bhk': bhk }] });
    }
    if (possession) andConditions.push({ 'filters.possession': possession });
    if (age) andConditions.push({ 'filters.age': age });
    if (postedBy) andConditions.push({ 'filters.postedBy': postedBy });
    if (furnishing) andConditions.push({ 'filters.furnishing': furnishing });
    if (facing) andConditions.push({ 'filters.facing': facing });
    if (parking) andConditions.push({ 'filters.parking': parking });
    if (availability) andConditions.push({ 'filters.availability': availability });

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // Multi-select containment for amenities
    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : amenities.split(',');
      query['filters.amenities'] = { $all: amenitiesList };
    }

    console.log('Property Query:', JSON.stringify(query, null, 2));
    const properties = await Property.find(query).populate('poster', 'name email phone').sort({ createdAt: -1 });
    console.log('Results found:', properties.length);
    res.json(properties);
  } catch (err) {
    console.error('Get Properties Error:', err);
    res.status(500).send('Server error');
  }
};

exports.createProperty = async (req, res) => {
  try {
    let data;
    try {
      data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
    } catch (e) {
      return res.status(400).json({ msg: 'Invalid JSON data format', error: e.message });
    }

    data.poster = req.user.id;
    data.slug = slugify(data.title, { lower: true }) + '-' + Date.now();
    
    // Validation
    if (!data.filters) {
      return res.status(400).json({ msg: 'Property filters are required' });
    }
    
    // Normalize and sanitize filters
    const validIntents = ['BUY', 'RENT'];
    const validSegments = ['RESIDENTIAL', 'COMMERCIAL', 'PLOTS_LAND', 'PROJECTS', 'NEW_LAUNCH'];
    
    if (!validIntents.includes(data.filters.intent)) data.filters.intent = 'BUY';
    if (!validSegments.includes(data.filters.segment)) data.filters.segment = 'RESIDENTIAL';

    // Handle Media Upload
    data.media = [];
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const image of images) {
        if (!image.tempFilePath) {
          console.warn('Skipping image upload: tempFilePath is missing');
          continue;
        }
        try {
          const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "doltec_properties",
          });

          data.media.push({ url: result.secure_url, publicId: result.public_id, isHero: data.media.length === 0 });
        } catch (uploadErr) {
          console.error('Cloudinary Upload Error:', uploadErr);
          return res.status(500).json({ msg: 'Failed to upload images', error: uploadErr.message });
        }
      }
    }

    const property = new Property(data);
    await property.save();
    res.json(property);
  } catch (err) {
    console.error('Property Create Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    let data;
    try {
      data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
    } catch (e) {
      return res.status(400).json({ msg: 'Invalid JSON data format', error: e.message });
    }

    const property = await Property.findOne({ slug: req.params.slug });
    if (!property) return res.status(404).json({ msg: 'Property not found' });
    
    if (property.poster.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Handle New Media Upload
    const newMedia = data.media || property.media || [];
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const image of images) {
        if (!image.tempFilePath) {
          console.warn('Skipping image upload: tempFilePath is missing');
          continue;
        }
        try {
          const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "doltec_properties",
          });
          newMedia.push({ url: result.secure_url, publicId: result.public_id, isHero: newMedia.length === 0 });
        } catch (uploadErr) {
          console.error('Cloudinary Upload Error:', uploadErr);
          return res.status(500).json({ msg: 'Failed to upload new images', error: uploadErr.message });
        }
      }
    }

    data.media = newMedia;

    const updatedProperty = await Property.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: data },
      { new: true }
    );
    res.json(updatedProperty);
  } catch (err) {
    console.error('Property Update Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};




exports.getPropertyBySlug = async (req, res) => {

  try {
    const property = await Property.findOne({ slug: req.params.slug }).populate('poster', 'name email phone');
    if (!property) return res.status(404).json({ msg: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ poster: req.user.id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

