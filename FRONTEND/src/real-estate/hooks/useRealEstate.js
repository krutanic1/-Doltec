import { useState, useEffect } from 'react';
import { listProperties, getPropertyBySlug } from '../services/realEstateApi';

export function usePropertyList(params) {
  const [data, setData] = useState({ data: [], totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listProperties(params)
      .then((res) => {
        if (!mounted) return;
        setData(res);
      })
      .catch((err) => mounted && setError(err))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}

export function usePropertyDetail(slug) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!slug) return;
    setLoading(true);
    getPropertyBySlug(slug)
      .then((res) => mounted && setProperty(res))
      .catch((err) => mounted && setError(err))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [slug]);

  return { property, loading, error };
}
