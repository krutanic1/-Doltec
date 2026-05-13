import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import usePropertyForm from '../hooks/usePropertyForm';
import { createProperty } from '../services/propertiesApi';

export default function PostProperty() {
  const navigate = useNavigate();
  const form = usePropertyForm();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      form.setLoading(true);
      form.setError('');
      const response = await createProperty(form.toFormData());
      navigate(`/real-estate/property/${response.data.slug}`);
    } catch (error) {
      form.setError(error.response?.data?.message || error.message || 'Failed to save property');
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Post a Property</h1>
        <p className="text-sm text-gray-600">Create a draft, upload images, then submit for moderation.</p>
      </div>
      <PropertyForm form={form} onSubmit={handleSubmit} />
    </section>
  );
}
