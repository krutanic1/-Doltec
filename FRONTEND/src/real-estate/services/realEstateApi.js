export async function listProperties({ page = 1, limit = 12, filters = {} } = {}) {
  const params = new URLSearchParams({ page, limit, ...filters });
  const res = await fetch(`/api/v1/properties?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
}

export async function getPropertyBySlug(slug) {
  const res = await fetch(`/api/v1/properties/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error('Failed to fetch property');
  return res.json();
}
