const Property = require('../models/Property');
const slugify = require('slugify');
const cloudinary = require("../middleware/cloudinary");

exports.getProperties = async (req, res) => {
  try {
    const { city, intent, segment, minPrice, maxPrice, bhk, q } = req.query;
    const query = { status: { $ne: 'REJECTED' } };

    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (intent) query.intent = intent;
    if (segment) query.segment = segment;
    if (bhk) query['features.bhk'] = Number(bhk);
    if (minPrice || maxPrice) {
      query['pricing.amount'] = {};
      if (minPrice) query['pricing.amount'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.amount'].$lte = Number(maxPrice);
    }
    if (q) query.title = { $regex: q, $options: 'i' };

    const properties = await Property.find(query).populate('poster', 'name email phone');
    res.json(properties);
  } catch (err) {
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

