import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';
import usePropertyForm from '../hooks/usePropertyForm';
import { getProperty, updateProperty } from '../services/propertiesApi';

const S = { font: 'Inter,sans-serif' };

const STEPS = [
  { n: '01', t: 'Basic Info' },
  { n: '02', t: 'Location & Details' },
  { n: '03', t: 'Photos' },
  { n: '04', t: 'Amenities' },
];

export default function EditProperty() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const form = usePropertyForm();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [fetching, setFetching] = React.useState(true);

  useEffect(() => {
    setFetching(true);
    getProperty(slug)
      .then(res => {
        const p = res.data || res;
        // Transform backend data to form values
        form.setValues({
          title: p.title || '',
          description: p.description || '',
          category: p.category || 'RESIDENTIAL',
          propertyType: p.propertyType || 'APARTMENT',
          price: { amount: p.price || '', currency: 'INR' },
          areaSqFt: p.features?.areaSqFt || '',
          locality: p.locality || '',
          city: p.city || '',
          state: p.location?.state || '',
          status: p.status || 'DRAFT',
          filters: {
            ...p.filters,
            readyToMove: p.filters?.possession === 'READY_TO_MOVE'
          }
        });
        setFetching(false);
      })
      .catch(err => {
        form.setError('Failed to fetch property details');
        setFetching(false);
      });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      form.setLoading(true);
      form.setError('');
      // Use _id for update if available, otherwise slug
      const p = await updateProperty(slug, form.toFormData());
      navigate(`/real-estate/properties/${p.slug || p._id}`);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.data?.msg === 'No token, authorization denied') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/real-estate/login');
        return;
      }
      form.setError(err.response?.data?.message || err.message || 'Failed to update property');
    } finally {
      form.setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: S.font }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontWeight: 600 }}>Loading property details...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: S.font, paddingBottom: 80 }}>
      <div style={{ 
        background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)', 
        padding: '100px 24px 80px', textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#fff', margin: 0 }}>Edit Property</h1>
        <p style={{ color: '#93c5fd', marginTop: 12 }}>Update your listing details to get better responses.</p>
      </div>

      <div style={{ maxWidth: 860, margin: '-48px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 24px 64px rgba(0,0,0,.08)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid #f1f5f9' }}>
            {STEPS.map((s, i) => (
              <div key={s.n} onClick={() => setCurrentStep(i)} style={{
                padding: '18px 16px', textAlign: 'center', cursor: 'pointer',
                borderRight: i < 3 ? '1px solid #f1f5f9' : 'none',
                background: i === currentStep ? '#eff6ff' : 'transparent',
                position: 'relative'
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: i === currentStep ? '#2563eb' : '#94a3b8', display: 'block', marginBottom: 4 }}>{s.n}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: i === currentStep ? '#0f172a' : '#94a3b8' }}>{s.t}</span>
                {i === currentStep && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 40, height: 3, background: '#2563eb', borderRadius: '3px 3px 0 0' }} />}
              </div>
            ))}
          </div>

          <div style={{ padding: '36px 40px' }}>
            {form.error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 12, padding: '14px 18px', marginBottom: 24, color: '#991b1b', fontSize: 13, fontWeight: 600 }}>
                ⚠️ {form.error}
              </div>
            )}
            <PropertyForm 
              form={form} 
              onSubmit={handleSubmit} 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
              totalSteps={STEPS.length} 
              isEdit={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
