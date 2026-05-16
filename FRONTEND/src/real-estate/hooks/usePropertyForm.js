import { useMemo, useState } from 'react';

const initialState = {
  title: '',
  description: '',
  category: 'RESIDENTIAL', // maps to segment/category
  propertyType: 'APARTMENT',
  price: { amount: '', currency: 'INR' },
  areaSqFt: '',
  locality: '',
  city: '',
  state: '',
  status: 'DRAFT',
  filters: {
    intent: 'BUY',
    segment: 'RESIDENTIAL',
    propertyType: 'APARTMENT',
    bhk: '2_BHK',
    possession: 'READY_TO_MOVE',
    age: 'NEW',
    postedBy: 'OWNER',
    amenities: [],
    furnishing: 'UNFURNISHED',
    facing: 'NORTH',
    parking: '1',
    availability: 'IMMEDIATE',
    readyToMove: true,
  }
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
      if (name.startsWith('filters.')) {
        const key = name.split('.')[1];
        return { ...current, filters: { ...current.filters, [key]: value } };
      }
      return { ...current, [name]: value };
    });
  }

  function toggleAmenity(val) {
    setValues(prev => {
      const current = prev.filters.amenities || [];
      const updated = current.includes(val) 
        ? current.filter(x => x !== val) 
        : [...current, val];
      return { ...prev, filters: { ...prev.filters, amenities: updated } };
    });
  }

  function onFiles(nextFiles) {
    setImages(Array.from(nextFiles || []));
  }

  function toFormData() {
    const formData = new FormData();
    
    // Package all non-file fields into a JSON string
    const data = {
      title: values.title,
      description: values.description,
      city: values.city,
      locality: values.locality,
      category: values.category,
      propertyType: values.propertyType,
      price: values.price.amount,
      status: values.status,
      filters: values.filters
    };

    formData.append('data', JSON.stringify(data));

    images.forEach((image) => formData.append('images', image));
    return formData;
  }

  return {
    values,
    setValues,
    setField,
    toggleAmenity,
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
