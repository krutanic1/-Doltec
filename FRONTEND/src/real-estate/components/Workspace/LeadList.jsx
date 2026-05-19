import React, { useState } from 'react';
import { updateLeadStatus, assignLead, addLeadComment } from '../../services/leadApi';

export default function LeadList({ items = [], loading = false, onRefresh = () => {} }) {
  const [busyId, setBusyId] = useState(null);

  if (loading) return <div>Loading leads...</div>;
  if (!items || items.length === 0) return <div>No leads found.</div>;

  async function handleStatus(id, status) {
    setBusyId(id);
    try {
      await updateLeadStatus(id, status);
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  }

  async function handleAssign(id) {
    const userId = prompt('Assign to user id:');
    if (!userId) return;
    setBusyId(id);
    try {
      await assignLead(id, userId);
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  }

  async function handleComment(id) {
    const message = prompt('Comment:');
    if (!message) return;
    setBusyId(id);
    try {
      await addLeadComment(id, message);
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-3">
      <button onClick={onRefresh} className="px-3 py-1 bg-blue-600 text-white rounded">Refresh</button>
      <div className="grid gap-2">
        {items.map((it) => (
          <div key={it._id} className="p-3 border rounded shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-medium">{it.name || it.email || 'Lead'}</div>
                <div className="text-sm text-gray-600">{it.email} • {it.phone}</div>
                <div className="text-sm text-gray-500">Property: {it.propertyId?.title || it.propertyId}</div>
              </div>
              <div className="text-sm text-gray-500">{new Date(it.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-sm">{it.message}</div>
            <div className="mt-2 flex gap-2">
              <button disabled={busyId===it._id} onClick={() => handleStatus(it._id, 'contacted')} className="px-2 py-1 bg-yellow-400 rounded">Contacted</button>
              <button disabled={busyId===it._id} onClick={() => handleStatus(it._id, 'converted')} className="px-2 py-1 bg-green-500 rounded text-white">Convert</button>
              <button disabled={busyId===it._id} onClick={() => handleStatus(it._id, 'closed')} className="px-2 py-1 bg-gray-400 rounded">Close</button>
              <button disabled={busyId===it._id} onClick={() => handleAssign(it._id)} className="px-2 py-1 bg-indigo-600 text-white rounded">Assign</button>
              <button disabled={busyId===it._id} onClick={() => handleComment(it._id)} className="px-2 py-1 bg-white border rounded">Comment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
