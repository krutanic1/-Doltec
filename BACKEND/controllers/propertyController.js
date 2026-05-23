const Property = require('../models/Property');
const SavedProperty = require('../models/SavedProperty');
const User = require('../models/User');
const Organization = require('../models/Organization');
const ListingUpgradeHistory = require('../models/ListingUpgradeHistory');
const CreditTransaction = require('../models/CreditTransaction');
const PropertyView = require('../models/PropertyView');
const slugify = require('slugify');
const cloudinary = require("../middleware/cloudinary");

function getActorId(req) {
  return req.user?.id || req.user?._id || req.user?.sub || null;
}

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

    const query = {};
    if (req.query.status && req.query.status !== 'ALL') {
      query.status = req.query.status;
    } else if (!req.query.status) {
      query.status = 'APPROVED';
    }

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

    // Always sort by advertising tier priority first (Platinum > Gold > Silver > Basic)
    const tierPriorityMap = {
      PREMIUM: 4,  // Platinum
      PLATINUM: 3, // Gold
      BASIC: 2,    // Silver
      PLAIN: 1     // Basic
    };
    properties.sort((a, b) => {
      const pA = tierPriorityMap[a.tier || 'PLAIN'] || 1;
      const pB = tierPriorityMap[b.tier || 'PLAIN'] || 1;
      if (pA !== pB) {
        return pB - pA; // Higher tier always gets top placement
      }
      
      // Secondary sorting logic inside each tier group
      if (sort === 'price_asc') {
        const priceA = a.pricing?.amount || a.price || 0;
        const priceB = b.pricing?.amount || b.price || 0;
        return priceA - priceB;
      }
      if (sort === 'price_desc') {
        const priceA = a.pricing?.amount || a.price || 0;
        const priceB = b.pricing?.amount || b.price || 0;
        return priceB - priceA;
      }
      
      // Default: Newest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

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
    
    if (req.query.page) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const total = properties.length;
      const paginated = properties.slice(skip, skip + limit);
      return res.json({
        properties: paginated,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      });
    } else if (req.query.limit) {
      const limit = parseInt(req.query.limit) || 10;
      return res.json(properties.slice(0, limit));
    }

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

    data.poster = getActorId(req);
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

    // Deduct credits if a premium tier is selected on creation
    const selectedTier = String(data.tier || 'PLAIN').toUpperCase();
    let creditsDeducted = 0;
    if (selectedTier !== 'PLAIN') {
      const tierCost = { BASIC: 1, PLATINUM: 3, PREMIUM: 5 };
      const cost = tierCost[selectedTier] || 0;
      
      if (cost > 0) {
        const actorId = getActorId(req);
        const user = await User.findById(actorId);
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }
        
        // If user belongs to an organization, check org limits, else check user jobLimit
        if (user.orgId) {
          const org = await Organization.findById(user.orgId);
          if (!org) {
            return res.status(404).json({ msg: 'Organization not found' });
          }
          const currentCredits = org.limits?.featuredSlots || 0;
          if (currentCredits < cost) {
            return res.status(402).json({ msg: `Insufficient credits in organization plan to post a ${selectedTier} listing. Cost is ${cost} credits, you have ${currentCredits}.` });
          }
          
          org.limits.featuredSlots = currentCredits - cost;
          org.markModified('limits');
          await org.save();
          
          // Log credit transaction
          const lastTx = await CreditTransaction.findOne({ orgId: user.orgId }).sort({ createdAt: -1 });
          const lastBalance = lastTx ? lastTx.balanceAfter : currentCredits;
          
          const transaction = new CreditTransaction({
            orgId: user.orgId,
            accountType: 'featured',
            direction: 'debit',
            amount: cost,
            balanceAfter: lastBalance - cost,
            reason: `Listing created directly with ${selectedTier} tier: ${data.title}`,
            refType: 'Property',
            createdBy: actorId
          });
          await transaction.save();
          creditsDeducted = cost;
          data.orgId = user.orgId;
        } else {
          const directCredits = user.jobLimit || 0;
          if (directCredits < cost) {
            return res.status(402).json({ msg: `Insufficient credits to post a ${selectedTier} listing. Cost is ${cost} credits, you have ${directCredits}.` });
          }
          user.jobLimit = directCredits - cost;
          await user.save();
          creditsDeducted = cost;
        }
        
        // Setup expiration date (30 days)
        data.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
    }

    data.status = 'PENDING';
    const property = new Property(data);
    await property.save();

    // Log upgrade history after saving to get the property ID
    if (selectedTier !== 'PLAIN') {
      const history = new ListingUpgradeHistory({
        propertyId: property._id,
        orgId: data.orgId || null,
        userId: getActorId(req),
        fromTier: 'PLAIN',
        toTier: selectedTier,
        creditsDeducted,
        reason: `Direct creation with promoted tier ${selectedTier}`
      });
      await history.save();
      
      // Update reference to transaction if org transaction exists
      await CreditTransaction.findOneAndUpdate(
        { refType: 'Property', createdBy: getActorId(req) },
        { $set: { refId: property._id } },
        { sort: { createdAt: -1 } }
      );
    }
    
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
    
    if (property.poster.toString() !== getActorId(req)) {
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

    // Smart unique view tracking
    const userId = getActorId(req) || null;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || '';
    const fingerprint = req.headers['x-device-id'] || ip;

    let isUniqueView = false;
    
    if (userId) {
        // Enforce 1 view per registered user across all time, regardless of IP/device
        const existingView = await PropertyView.findOne({ propertyId: property._id, userId });
        if (!existingView) isUniqueView = true;
    } else {
        // For anonymous, use IP or Fingerprint
        const existingView = await PropertyView.findOne({ propertyId: property._id, $or: [{ ip }, { fingerprint }] });
        if (!existingView) isUniqueView = true;
    }

    if (isUniqueView) {
        try {
            await PropertyView.create({
                propertyId: property._id,
                userId,
                ip,
                userAgent,
                fingerprint
            });
            // Atomically increment the actual property stats
            property.metrics.views = (property.metrics.views || 0) + 1;
            await property.save();
        } catch (viewErr) {
            // Safely ignore duplicate key insertion constraints from concurrent rapid requests
        }
    }

    res.json(property);
  } catch (err) {
    console.error('getPropertyBySlug Error:', err);
    res.status(500).send('Server error');
  }
};

exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ poster: getActorId(req) }).sort({ createdAt: -1 });
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

exports.getSavedProperties = async (req, res) => {
  try {
    const userId = getActorId(req);
    if (!userId) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const savedItems = await SavedProperty.find({ userId })
      .populate({
        path: 'propertyId',
        populate: { path: 'poster', select: 'name email phone' },
      })
      .sort({ createdAt: -1 });

    const properties = savedItems.map((item) => item.propertyId).filter(Boolean);
    return res.status(200).json({ success: true, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveProperty = async (req, res) => {
  try {
    const userId = getActorId(req);
    if (!userId) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const propertyId = req.params.id;
    const property = await Property.findById(propertyId).select('_id');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const saved = await SavedProperty.findOneAndUpdate(
      { userId, propertyId },
      { userId, propertyId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, message: 'Property saved', data: saved });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ success: true, message: 'Property saved' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.unsaveProperty = async (req, res) => {
  try {
    const userId = getActorId(req);
    if (!userId) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const result = await SavedProperty.deleteOne({
      userId,
      propertyId: req.params.id,
    });

    return res.status(200).json({ success: true, message: 'Property removed from saved list', deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
