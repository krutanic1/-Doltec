import React from 'react';

export default function InquiryList({ items = [], loading = false, onRefresh = () => {} }) {
  if (loading) return <div>Loading inquiries...</div>;
  if (!items || items.length === 0) return <div>No inquiries found.</div>;

  return (
    <div className="space-y-3">
      <button onClick={onRefresh} className="px-3 py-1 bg-blue-600 text-white rounded">Refresh</button>
      <div className="grid gap-2">
        {items.map((it) => (
          <div key={it._id} className="p-3 border rounded shadow-sm">
            <div className="flex justify-between">
              <div>
                <div className="text-lg font-medium">{it.title || it.sender?.name || 'Inquiry'}</div>
                <div className="text-sm text-gray-600">{it.sender?.email} • {it.sender?.phone}</div>
              </div>
              <div className="text-sm text-gray-500">{new Date(it.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-sm">{it.message}</div>
            <div className="mt-2 text-xs text-gray-500">Status: {it.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
