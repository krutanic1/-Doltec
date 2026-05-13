import React, { useEffect, useState } from 'react';
import api from '../services/api/axios';
import PropertyStatusBadge from '../components/PropertyStatusBadge';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/properties', { params: { ownerId: 'me', limit: 12 } })
      .then((res) => setItems(res.data.data || []))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((property) => (
          <article key={property._id} className="rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-medium">{property.title}</h2>
              <PropertyStatusBadge status={property.status} />
            </div>
            <p className="mt-2 text-sm text-gray-600">{property.locality || property.locationText}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
