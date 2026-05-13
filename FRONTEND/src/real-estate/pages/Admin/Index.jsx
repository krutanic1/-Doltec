import React, { useEffect, useState } from 'react';
import api from '../../services/api/axios';
import PropertyStatusBadge from '../../components/PropertyStatusBadge';
import { moderateProperty } from '../../services/propertiesApi';

export default function AdminIndex() {
  const [items, setItems] = useState([]);

  const load = () => {
    api.get('/properties', { params: { status: 'pending_review', limit: 20 } })
      .then((res) => setItems(res.data.data || []));
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await moderateProperty(id, { status: 'approved', reviewNote: 'Approved by admin' });
    load();
  };

  const reject = async (id) => {
    await moderateProperty(id, { status: 'rejected', reviewNote: 'Rejected by admin' });
    load();
  };

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Admin Panel</h1>
      <div className="grid gap-4">
        {items.map((property) => (
          <article key={property._id} className="rounded-xl border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-medium">{property.title}</h2>
                <p className="text-sm text-gray-600">{property.locationText}</p>
              </div>
              <PropertyStatusBadge status={property.status} />
            </div>
            <div className="mt-4 flex gap-3">
              <button className="rounded bg-emerald-600 px-4 py-2 text-white" onClick={() => approve(property._id)}>Approve</button>
              <button className="rounded bg-red-600 px-4 py-2 text-white" onClick={() => reject(property._id)}>Reject</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
