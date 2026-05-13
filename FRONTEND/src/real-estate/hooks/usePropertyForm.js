import { useMemo, useState } from 'react';

const initialState = {
  title: '',
  description: '',
  type: 'buy',
  category: 'apartment',
  price: { amount: '', currency: 'INR' },
  areaSqFt: '',
  bhk: '',
  bathrooms: '',
  furnishing: 'unfurnished',
  amenities: '',
  locality: '',
  city: '',
  state: '',
  posterName: '',
  posterEmail: '',
  posterPhone: '',
  status: 'draft',
};

export default function usePropertyForm(seed = {}) {
  const [values, setValues] = useState({ ...initialState, ...seed });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const preview = useMemo(() => ({
    title: values.title,
    locality: values.locality,
    city: values.city,
    category: values.category,
    price: values.price.amount,
    status: values.status,
    imageCount: images.length,
  }), [values, images]);

  function setField(name, value) {
    setValues((current) => {
      if (name.startsWith('price.')) {
        const key = name.split('.')[1];
        return { ...current, price: { ...current.price, [key]: value } };
      }
      return { ...current, [name]: value };
    });
  }

  function onFiles(nextFiles) {
    setImages(Array.from(nextFiles || []));
  }

  function toFormData() {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'price') {
        formData.append('price[amount]', value.amount);
        formData.append('price[currency]', value.currency || 'INR');
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
        return;
      }
      formData.append(key, value ?? '');
    });

    if (values.amenities) {
      formData.set('amenities', values.amenities);
    }

    images.forEach((image) => formData.append('images', image));
    return formData;
  }

  return {
    values,
    setValues,
    setField,
    images,
    onFiles,
    loading,
    setLoading,
    error,
    setError,
    preview,
    toFormData,
  };
}
