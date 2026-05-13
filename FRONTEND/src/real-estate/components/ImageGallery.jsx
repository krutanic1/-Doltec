import React from 'react';

export default function ImageGallery({ images = [] }) {
  if (!images.length) {
    return <div className="rounded border border-dashed p-6 text-sm text-gray-500">No images available</div>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <figure key={image.public_id || image.url || index} className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <img src={image.url || image} alt={image.alt || 'Property image'} className="h-64 w-full object-cover" loading="lazy" />
        </figure>
      ))}
    </div>
  );
}
