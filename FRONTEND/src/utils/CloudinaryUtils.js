/**
 * Cloudinary image optimization utilities
 */

/**
 * Optimize Cloudinary URL with quality and size parameters
 * @param {string} url - Original Cloudinary URL
 * @param {number} width - Desired width in pixels
 * @param {number} quality - Quality setting (1-100)
 * @returns {string} Optimized URL
 */
export const optimizeCloudinaryUrl = (url, width = 400, quality = 80) => {
  if (!url || typeof url !== "string") return url;

  // Check if it's a Cloudinary URL
  if (!url.includes("cloudinary.com")) return url;

  // Parse the URL to insert transformation params
  // Format: https://res.cloudinary.com/cloud/image/upload/v123/path
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  const transformations = `w_${width},q_${quality},f_auto`;
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

/**
 * Get thumbnail version of image (smaller, lower quality)
 */
export const getThumbnailUrl = (url) => {
  return optimizeCloudinaryUrl(url, 200, 70);
};

/**
 * Get card preview version of image (medium size)
 */
export const getCardImageUrl = (url) => {
  return optimizeCloudinaryUrl(url, 400, 80);
};

/**
 * Get full quality version of image (for modal/gallery)
 */
export const getFullImageUrl = (url) => {
  return optimizeCloudinaryUrl(url, 1200, 85);
};
