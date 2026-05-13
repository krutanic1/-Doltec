import React from 'react';

export default function PropertyForm({ form, onSubmit }) {
  const { values, setField, onFiles, loading, error, preview } = form;

  return (
    <form className="space-y-4" onSubmit={onSubmit} encType="multipart/form-data">
      <div className="grid gap-4 md:grid-cols-2">
        <input className="border rounded p-3" placeholder="Property title" value={values.title} onChange={(e) => setField('title', e.target.value)} />
        <select className="border rounded p-3" value={values.status} onChange={(e) => setField('status', e.target.value)}>
          <option value="draft">Draft</option>
          <option value="pending_review">Pending Review</option>
          <option value="published">Published</option>
        </select>
        <select className="border rounded p-3" value={values.type} onChange={(e) => setField('type', e.target.value)}>
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
        </select>
        <select className="border rounded p-3" value={values.category} onChange={(e) => setField('category', e.target.value)}>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>
        <input className="border rounded p-3" placeholder="Price" type="number" value={values.price.amount} onChange={(e) => setField('price.amount', e.target.value)} />
        <input className="border rounded p-3" placeholder="BHK" type="number" value={values.bhk} onChange={(e) => setField('bhk', e.target.value)} />
      </div>

      <textarea className="border rounded p-3 w-full min-h-32" placeholder="Description" value={values.description} onChange={(e) => setField('description', e.target.value)} />

      <div className="grid gap-4 md:grid-cols-3">
        <input className="border rounded p-3" placeholder="Locality" value={values.locality} onChange={(e) => setField('locality', e.target.value)} />
        <input className="border rounded p-3" placeholder="City" value={values.city} onChange={(e) => setField('city', e.target.value)} />
        <input className="border rounded p-3" placeholder="State" value={values.state} onChange={(e) => setField('state', e.target.value)} />
      </div>

      <input className="border rounded p-3 w-full" placeholder="Amenities comma separated" value={values.amenities} onChange={(e) => setField('amenities', e.target.value)} />

      <div className="grid gap-4 md:grid-cols-3">
        <input className="border rounded p-3" placeholder="Poster name" value={values.posterName} onChange={(e) => setField('posterName', e.target.value)} />
        <input className="border rounded p-3" placeholder="Poster email" value={values.posterEmail} onChange={(e) => setField('posterEmail', e.target.value)} />
        <input className="border rounded p-3" placeholder="Poster phone" value={values.posterPhone} onChange={(e) => setField('posterPhone', e.target.value)} />
      </div>

      <input type="file" multiple accept="image/*" onChange={(e) => onFiles(e.target.files)} />

      <div className="rounded border bg-gray-50 p-3 text-sm">
        <strong>Preview:</strong> {preview.title || 'Untitled'} in {preview.locality || 'Unknown locality'} • {preview.city || 'Unknown city'} • {preview.imageCount} images
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="rounded bg-black px-4 py-3 text-white disabled:opacity-50">
        {loading ? 'Saving...' : 'Save Property'}
      </button>
    </form>
  );
}
