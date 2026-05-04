/**
 * Cloudinary image optimization utilities
 */

/**
 * Optimize Cloudinary URL with quality and size parameters
 * @param {string} url - Original Cloudinary URL
 * @param {number} width - Desired width in pixels
 * @param {number} quality - Quality setting (1-100)
 * @returns {string} Optimized URL or original if transformation fails
 */
export const optimizeCloudinaryUrl = (url, width = 400, quality = 80) => {
  if (!url || typeof url !== "string") return url;

  try {
    // Check if it's a Cloudinary URL
    if (!url.includes("cloudinary.com")) return url;

    // Parse the URL to insert transformation params
    // Format: https://res.cloudinary.com/cloud/image/upload/v123/path
    const parts = url.split("/upload/");
    if (parts.length !== 2) return url;

    const transformations = `w_${width},q_${quality},f_auto`;
    const optimizedUrl = `${parts[0]}/upload/${transformations}/${parts[1]}`;
    
    return optimizedUrl;
  } catch (error) {
    console.warn("Failed to optimize Cloudinary URL, using original:", error);
    return url;
  }
};

/**
 * Get thumbnail version of image (smaller, lower quality)
 */
export const getThumbnailUrl = (url) => {
  try {
    return optimizeCloudinaryUrl(url, 200, 70);
  } catch (error) {
    console.warn("Failed to get thumbnail URL:", error);
    return url;
  }
};

/**
 * Get card preview version of image (medium size)
 */
export const getCardImageUrl = (url) => {
  try {
    return optimizeCloudinaryUrl(url, 400, 80);
  } catch (error) {
    console.warn("Failed to get card image URL:", error);
    return url;
  }
};

/**
 * Get full quality version of image (for modal/gallery)
 */
export const getFullImageUrl = (url) => {
  try {
    return optimizeCloudinaryUrl(url, 1200, 85);
  } catch (error) {
    console.warn("Failed to get full image URL:", error);
    return url;
  }
};
