import React from 'react';

const colors = {
  draft: 'bg-gray-100 text-gray-700',
  pending_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-emerald-100 text-emerald-800',
  published: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  archived: 'bg-slate-100 text-slate-800',
};

export default function PropertyStatusBadge({ status }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${colors[status] || colors.draft}`}>{status}</span>;
}
