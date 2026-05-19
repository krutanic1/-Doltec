const Property = require('../models/Property');
const slugify = require('slugify');
const cloudinary = require("../middleware/cloudinary");

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const earthRadiusKm = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const startLat = (lat1 * Math.PI) / 180;
  const endLat = (lat2 * Math.PI) / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(startLat) * Math.cos(endLat);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

exports.getProperties = async (req, res) => {
  try {
    const { 
      city, q, minPrice, maxPrice, budget,
      intent, segment, propertyType, bhk, 
      possession, age, postedBy, amenities, 
      furnishing, facing, parking, availability,
      lat, lng, radius, sort
    } = req.query;

    const query = { status: req.query.status || 'APPROVED' };

    // Search and Location
    if (city) query['city'] = { $regex: city, $options: 'i' };
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { locality: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Price Range & Budget Slabs
    if (budget) {
      const slabs = intent === 'RENT' ? [
        { label: 'Under ₹10k', min: 0, max: 10000 },
        { label: '₹10k - ₹25k', min: 10000, max: 25000 },
        { label: '₹25k - ₹50k', min: 25000, max: 50000 },
        { label: '₹50k - ₹1L', min: 50000, max: 100000 },
        { label: '₹1L+', min: 100000, max: 999999999 },
      ] : [
        { label: 'Under ₹50L', min: 0, max: 5000000 },
        { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
        { label: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000 },
        { label: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000 },
        { label: '₹5Cr+', min: 50000000, max: 999999999 },
      ];
      const slab = slabs.find(s => s.label === budget);
      if (slab) {
        query['price'] = { $gte: slab.min, $lte: slab.max };
      }
    } else if (minPrice || maxPrice) {
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

    // Sorting logic
    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1, createdAt: -1 };
    else if (sort === 'price_desc') sortObj = { price: -1, createdAt: -1 };

    console.log('Property Query:', JSON.stringify(query, null, 2));
    let properties = await Property.find(query).populate('poster', 'name email phone').sort(sortObj);

    const centerLat = toNumber(lat);
    const centerLng = toNumber(lng);
    const searchRadius = toNumber(radius) || 10;

    if (centerLat !== null && centerLng !== null) {
      properties = properties
        .map((property) => {
          const coords = property.location?.coordinates;
          const propLat = toNumber(coords?.lat);
          const propLng = toNumber(coords?.lng);

          if (propLat === null || propLng === null) {
            return null;
          }

          const distanceKm = getDistanceKm(centerLat, centerLng, propLat, propLng);
          if (distanceKm > searchRadius) {
            return null;
          }

          const nextProperty = property.toObject ? property.toObject() : property;
          nextProperty.distanceKm = Number(distanceKm.toFixed(2));
          return nextProperty;
        })
        .filter(Boolean);
      
      // If we are searching nearby, we usually want to sort by distance first
      // But if a specific sort was requested (price), we might want to keep that.
      // For now, let's stick to distance if nearby is active, or use the requested sort.
      if (!sort || sort === 'newest') {
        properties.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
      }
    }

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
    
    console.log('--- Create Property Debug ---');
    console.log('Files received:', req.files ? Object.keys(req.files) : 'None');
    if (req.files && req.files.images) {
      const imgCount = Array.isArray(req.files.images) ? req.files.images.length : 1;
      console.log('Images count:', imgCount);
    }
    console.log('Data received:', JSON.stringify(data, null, 2));
    console.log('-----------------------------');
    
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

    data.status = 'PENDING';
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

exports.getCities = async (req, res) => {
  try {
    const cities = await Property.distinct('city', { status: { $ne: 'REJECTED' } });
    res.json(cities.filter(Boolean));
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getLocalities = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = { status: { $ne: 'REJECTED' } };
    if (city) {
      // Match city case-insensitively
      filter.city = { $regex: city, $options: 'i' };
    }
    const localities = await Property.distinct('locality', filter);
    res.json(localities.filter(Boolean));
  } catch (err) {
    console.error('Get Localities Error:', err);
    res.status(500).send('Server error');
  }
};

exports.moderateProperty = async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote },
      { new: true }
    );

    if (!property) return res.status(404).json({ msg: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
