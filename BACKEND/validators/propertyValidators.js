const allowedStatuses = ['draft', 'pending_review', 'approved', 'rejected', 'published', 'archived'];
const allowedTypes = ['buy', 'rent'];
const allowedCategories = ['apartment', 'villa', 'plot', 'commercial'];
const allowedFurnishing = ['furnished', 'semi-furnished', 'unfurnished'];

function asString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function validateCreateProperty(body) {
  const errors = [];
  const title = asString(body.title);
  const type = asString(body.type);
  const category = asString(body.category);
  const priceAmount = Number(body?.price?.amount ?? body.priceAmount);
  const bhk = body.bhk === undefined || body.bhk === null || body.bhk === '' ? undefined : Number(body.bhk);
  const bathrooms = body.bathrooms === undefined || body.bathrooms === null || body.bathrooms === '' ? undefined : Number(body.bathrooms);

  if (!title) errors.push({ field: 'title', message: 'Title is required' });
  if (!allowedTypes.includes(type)) errors.push({ field: 'type', message: 'Type must be buy or rent' });
  if (!allowedCategories.includes(category)) errors.push({ field: 'category', message: 'Invalid category' });
  if (!Number.isFinite(priceAmount) || priceAmount < 0) errors.push({ field: 'price.amount', message: 'Valid price is required' });
  if (bhk !== undefined && (!Number.isInteger(bhk) || bhk < 0)) errors.push({ field: 'bhk', message: 'BHK must be a non-negative integer' });
  if (bathrooms !== undefined && (!Number.isInteger(bathrooms) || bathrooms < 0)) errors.push({ field: 'bathrooms', message: 'Bathrooms must be a non-negative integer' });

  return {
    error: errors.length ? { details: errors, message: 'Validation failed' } : null,
    value: {
      title,
      description: asString(body.description),
      type,
      category,
      price: { amount: priceAmount, currency: asString(body?.price?.currency, 'INR') || 'INR' },
      areaSqFt: body.areaSqFt === undefined || body.areaSqFt === null || body.areaSqFt === '' ? undefined : Number(body.areaSqFt),
      bhk,
      bathrooms,
      furnishing: allowedFurnishing.includes(asString(body.furnishing)) ? asString(body.furnishing) : undefined,
      amenities: Array.isArray(body.amenities)
        ? body.amenities.map((item) => asString(item)).filter(Boolean)
        : asString(body.amenities)
          ? asString(body.amenities).split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      locality: asString(body.locality),
      city: asString(body.city),
      state: asString(body.state),
      locationText: asString(body.locationText) || [body.locality, body.city, body.state].filter(Boolean).join(', '),
      posterName: asString(body.posterName),
      posterEmail: asString(body.posterEmail),
      posterPhone: asString(body.posterPhone),
      status: allowedStatuses.includes(asString(body.status)) ? asString(body.status) : 'draft',
      search_terms: Array.isArray(body.search_terms) ? body.search_terms.map((item) => asString(item).toLowerCase()).filter(Boolean) : [],
      location: body.location || undefined,
    },
  };
}

function validateUpdateProperty(body) {
  const result = validateCreateProperty({
    ...body,
    title: body.title || 'Property',
    type: body.type || 'buy',
    category: body.category || 'apartment',
    price: body.price || { amount: 0, currency: 'INR' },
  });

  return {
    error: result.error,
    value: {
      ...(body.title !== undefined ? { title: result.value.title } : {}),
      ...(body.description !== undefined ? { description: result.value.description } : {}),
      ...(body.type !== undefined ? { type: result.value.type } : {}),
      ...(body.category !== undefined ? { category: result.value.category } : {}),
      ...(body.price !== undefined || body.priceAmount !== undefined ? { price: result.value.price } : {}),
      ...(body.areaSqFt !== undefined ? { areaSqFt: result.value.areaSqFt } : {}),
      ...(body.bhk !== undefined ? { bhk: result.value.bhk } : {}),
      ...(body.bathrooms !== undefined ? { bathrooms: result.value.bathrooms } : {}),
      ...(body.furnishing !== undefined ? { furnishing: result.value.furnishing } : {}),
      ...(body.amenities !== undefined ? { amenities: result.value.amenities } : {}),
      ...(body.locality !== undefined ? { locality: result.value.locality } : {}),
      ...(body.city !== undefined ? { city: result.value.city } : {}),
      ...(body.state !== undefined ? { state: result.value.state } : {}),
      ...(body.locationText !== undefined ? { locationText: result.value.locationText } : {}),
      ...(body.posterName !== undefined ? { posterName: result.value.posterName } : {}),
      ...(body.posterEmail !== undefined ? { posterEmail: result.value.posterEmail } : {}),
      ...(body.posterPhone !== undefined ? { posterPhone: result.value.posterPhone } : {}),
      ...(body.status !== undefined ? { status: result.value.status } : {}),
      ...(body.search_terms !== undefined ? { search_terms: result.value.search_terms } : {}),
      ...(body.location !== undefined ? { location: result.value.location } : {}),
    },
  };
}

function validateModeration(body) {
  const status = asString(body.status);
  const errors = [];
  if (!allowedStatuses.includes(status)) {
    errors.push({ field: 'status', message: 'Invalid moderation status' });
  }

  return {
    error: errors.length ? { details: errors, message: 'Validation failed' } : null,
    value: {
      status,
      reviewNote: asString(body.reviewNote),
    },
  };
}

module.exports = {
  validateCreateProperty,
  validateUpdateProperty,
  validateModeration,
};
