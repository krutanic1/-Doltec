const crypto = require('crypto');
const cloudinary = require('../middleware/cloudinary');
const Property = require('../models/Property');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function extractPublicIdFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const uploadIndex = pathname.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    let publicId = pathname.slice(uploadIndex + '/upload/'.length);
    publicId = publicId.replace(/^v\d+\//, '');
    publicId = publicId.replace(/\.[^.\/]+$/, '');
    return publicId || null;
  } catch (error) {
    return null;
  }
}

function buildSearchTerms(payload) {
  const base = [
    payload.title,
    payload.category,
    payload.type,
    payload.furnishing,
    payload.locality,
    payload.city,
    payload.state,
    payload.locationText,
    String(payload.bhk || ''),
    String(payload.price?.amount || ''),
    ...(payload.amenities || []),
  ]
    .filter(Boolean)
    .map((item) => String(item).toLowerCase());

  return Array.from(new Set(base.flatMap((item) => item.split(/\s+/).filter(Boolean))));
}

function uniqueSlug(title, id) {
  const short = id ? String(id).slice(-6) : crypto.randomBytes(3).toString('hex');
  return `${slugify(title).slice(0, 120)}-${short}`;
}

async function uploadImages(files) {
  const list = Array.isArray(files) ? files : [files];
  const uploads = await Promise.all(
    list.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: 'doltec_properties', resource_type: 'image' },
              (error, result) => {
                if (error) return reject(error);
                return resolve({
                  public_id: result.public_id,
                  url: result.secure_url,
                  width: result.width,
                  height: result.height,
                  format: result.format,
                });
              }
            )
            .end(file.data);
        })
    )
  );

  return uploads;
}

async function deleteImages(images = []) {
  const publicIds = (images || [])
    .map((image) => image?.public_id || extractPublicIdFromUrl(image?.url || image))
    .filter(Boolean);

  if (!publicIds.length) return;

  await Promise.allSettled(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId, { resource_type: 'image' })));
}

async function createProperty(payload, files, owner) {
  if (!files || !files.images) {
    const error = new Error('At least one property image is required');
    error.statusCode = 400;
    throw error;
  }

  const imageFiles = Array.isArray(files.images) ? files.images : [files.images];
  if (imageFiles.some((file) => !file.mimetype || !file.mimetype.startsWith('image/'))) {
    const error = new Error('Only image files are allowed');
    error.statusCode = 400;
    throw error;
  }

  const images = await uploadImages(imageFiles);
  const search_terms = payload.search_terms?.length ? payload.search_terms : buildSearchTerms(payload);
  const property = await Property.create({
    ...payload,
    ownerId: owner?._id || payload.ownerId || null,
    posterName: payload.posterName || owner?.name || '',
    posterEmail: payload.posterEmail || owner?.email || '',
    posterPhone: payload.posterPhone || owner?.phone || '',
    images,
    search_terms,
    slug: payload.slug || uniqueSlug(payload.title),
    status: payload.status || 'draft',
  });

  return property;
}

async function updateProperty(id, payload, files, actor) {
  const property = await Property.findById(id);
  if (!property) {
    const error = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  const canEdit = String(property.ownerId || '') === String(actor?._id || actor?.sub || '') || actor?.role === 'admin';
  if (!canEdit) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  const previousTitle = property.title;
  Object.assign(property, payload);

  if (payload.title && payload.title !== previousTitle) {
    property.slug = uniqueSlug(payload.title, property._id);
  }

  if (files?.images) {
    const uploaded = await uploadImages(files.images);
    property.images = [...(property.images || []), ...uploaded];
  }

  property.search_terms = payload.search_terms?.length ? payload.search_terms : buildSearchTerms(property.toObject());
  if (!property.status || property.status === 'published') {
    property.status = 'draft';
  }
  await property.save();
  return property;
}

async function deleteProperty(id, actor) {
  const property = await Property.findById(id);
  if (!property) {
    const error = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  const canDelete = String(property.ownerId || '') === String(actor?._id || actor?.sub || '') || actor?.role === 'admin';
  if (!canDelete) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  await deleteImages(property.images);
  await Property.findByIdAndDelete(id);
  return property;
}

async function moderateProperty(id, payload, actor) {
  const property = await Property.findById(id);
  if (!property) {
    const error = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  if (actor?.role !== 'admin') {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  property.status = payload.status;
  property.moderation.reviewedBy = actor?._id || actor?.sub || null;
  property.moderation.reviewedAt = new Date();
  property.moderation.reviewNote = payload.reviewNote || '';
  if (payload.status === 'approved' || payload.status === 'published') {
    property.moderation.publishedAt = new Date();
  }
  await property.save();
  return property;
}

async function listProperties(query) {
  const {
    page = 1,
    limit = 12,
    search,
    type,
    category,
    status = 'published',
    minPrice,
    maxPrice,
    bhk,
    bathrooms,
    furnishing,
    locality,
    city,
    amenities,
    ownerId,
  } = query;

  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (ownerId) filter.ownerId = ownerId;
  if (furnishing) filter.furnishing = furnishing;
  if (locality) filter.locality = new RegExp(locality, 'i');
  if (city) filter.city = new RegExp(city, 'i');
  if (bhk) filter.bhk = Number(bhk);
  if (bathrooms) filter.bathrooms = Number(bathrooms);
  if (minPrice || maxPrice) {
    filter['price.amount'] = {};
    if (minPrice) filter['price.amount'].$gte = Number(minPrice);
    if (maxPrice) filter['price.amount'].$lte = Number(maxPrice);
  }
  if (amenities) {
    const list = Array.isArray(amenities) ? amenities : String(amenities).split(',');
    filter.amenities = { $all: list.map((item) => String(item).trim()).filter(Boolean) };
  }

  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(limit) || 12));
  const skip = (pageNumber - 1) * pageSize;

  if (search) {
    filter.$text = { $search: String(search) };
  }

  const projection = search ? { score: { $meta: 'textScore' } } : {};
  const sort = search ? { score: { $meta: 'textScore' }, createdAt: -1 } : { createdAt: -1 };

  const [items, totalCount] = await Promise.all([
    Property.find(filter, projection).sort(sort).skip(skip).limit(pageSize).lean(),
    Property.countDocuments(filter),
  ]);

  return {
    data: items,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    currentPage: pageNumber,
    pageSize,
  };
}

async function getPropertyBySlug(slug, actor) {
  const filter = { $or: [{ slug }, { _id: slug }] };
  if (actor?.role !== 'admin') {
    filter.status = { $in: ['approved', 'published'] };
  }

  const property = await Property.findOne(filter).lean();
  if (!property) {
    const error = new Error('Property not found');
    error.statusCode = 404;
    throw error;
  }

  return property;
}

module.exports = {
  createProperty,
  updateProperty,
  deleteProperty,
  moderateProperty,
  listProperties,
  getPropertyBySlug,
  buildSearchTerms,
  uniqueSlug,
};
