import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  INTENT_OPTIONS, 
  SEGMENT_OPTIONS, 
  PROPERTY_TYPE_OPTIONS, 
  BHK_OPTIONS, 
  POSSESSION_OPTIONS, 
  AGE_OPTIONS, 
  POSTED_BY_OPTIONS, 
  FURNISHING_OPTIONS, 
  FACING_OPTIONS, 
  PARKING_OPTIONS, 
  AMENITIES_OPTIONS, 
  AVAILABILITY_OPTIONS 
} from '../real-estate/constants/filterOptions';

export default function CreateProperty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    city: '', 
    locality: '', 
    price: '',
    category: 'RESIDENTIAL',
    propertyType: 'APARTMENT',
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
    }
  });
  const [selectedImages, setSelectedImages] = useState([]);

  const onChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('filters.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        filters: { ...prev.filters, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSegmentChange = (e) => {
    const segment = e.target.value;
    const firstType = PROPERTY_TYPE_OPTIONS[segment]?.[0]?.value || '';
    setFormData(prev => ({
      ...prev,
      category: segment,
      propertyType: firstType,
      filters: { ...prev.filters, segment, propertyType: firstType }
    }));
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => {
      const current = prev.filters.amenities || [];
      const updated = current.includes(amenity) 
        ? current.filter(a => a !== amenity)
        : [...current, amenity];
      return { ...prev, filters: { ...prev.filters, amenities: updated } };
    });
  };

  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to post a property');
        window.location.href = '/real-estate/login';
        return;
      }
      const formDataToSend = new FormData();
      
      const propertyData = {
        title: formData.title,
        description: formData.description,
        city: formData.city,
        locality: formData.locality,
        category: formData.category,
        propertyType: formData.propertyType,
        price: Number(formData.price),
        filters: formData.filters
      };

      formDataToSend.append('data', JSON.stringify(propertyData));
      selectedImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      await axios.post('http://localhost:5000/api/v1/properties', formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/real-estate/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/real-estate/login';
      } else {
        alert('Failed to post property');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-8">Post New Property</h1>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Step 1: Category & Intent</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Intent</label>
                  <select name="filters.intent" value={formData.filters.intent} onChange={onChange} className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600">
                    {INTENT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Segment</label>
                  <select name="category" value={formData.category} onChange={handleSegmentChange} className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600">
                    {SEGMENT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Property Type</label>
                  <select name="propertyType" value={formData.propertyType} onChange={e => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, propertyType: val, filters: { ...prev.filters, propertyType: val } }));
                  }} className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600">
                    {(PROPERTY_TYPE_OPTIONS[formData.category] || []).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                <input type="text" name="title" value={formData.title} onChange={onChange} required placeholder="e.g. Modern 3BHK Apartment" className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600" />
              </div>
              <button type="button" onClick={() => setStep(2)} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-colors">Next: Location & Price →</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Step 2: Location & Price</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">City</label>
                  <input type="text" name="city" value={formData.city} onChange={onChange} required className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Locality</label>
                  <input type="text" name="locality" value={formData.locality} onChange={onChange} required className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={onChange} required className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600" />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-900 font-black py-4 rounded-xl hover:bg-slate-200 transition-colors">← Back</button>
                <button type="button" onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-colors">Next: Details →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Step 3: Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {formData.category === 'RESIDENTIAL' && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">BHK Type</label>
                    <select name="filters.bhk" value={formData.filters.bhk} onChange={onChange} className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600">
                      {BHK_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Possession</label>
                  <select name="filters.possession" value={formData.filters.possession} onChange={onChange} className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600">
                    {POSSESSION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Age of Property</label>
                  <select name="filters.age" value={formData.filters.age} onChange={onChange} className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600">
                    {AGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Furnishing</label>
                  <select name="filters.furnishing" value={formData.filters.furnishing} onChange={onChange} className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600">
                    {FURNISHING_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Facing</label>
                  <select name="filters.facing" value={formData.filters.facing} onChange={onChange} className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600">
                    {FACING_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Parking</label>
                  <select name="filters.parking" value={formData.filters.parking} onChange={onChange} className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600">
                    {PARKING_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea name="description" value={formData.description} onChange={onChange} rows="4" className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600"></textarea>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(2)} className="flex-1 bg-slate-100 text-slate-900 font-black py-4 rounded-xl hover:bg-slate-200 transition-colors">← Back</button>
                <button type="button" onClick={() => setStep(4)} className="flex-[2] bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-colors">Next: Amenities →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Step 4: Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES_OPTIONS.map(opt => (
                  <label key={opt.value} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.filters.amenities.includes(opt.value) ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                    <input type="checkbox" className="hidden" checked={formData.filters.amenities.includes(opt.value)} onChange={() => toggleAmenity(opt.value)} />
                    <span className="font-bold text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(3)} className="flex-1 bg-slate-100 text-slate-900 font-black py-4 rounded-xl hover:bg-slate-200 transition-colors">← Back</button>
                <button type="button" onClick={() => setStep(5)} className="flex-[2] bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-colors">Next: Photos →</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Step 5: Property Photos</h2>
              <div className="border-4 border-dashed border-slate-100 rounded-[40px] p-12 text-center">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-5xl mb-4">📸</div>
                  <p className="text-slate-900 font-black text-xl mb-2">Upload Photos</p>
                  <p className="text-slate-500 font-medium">Select images of your property</p>
                </label>
              </div>
              {selectedImages.length > 0 && (
                <p className="text-center font-bold text-green-600">{selectedImages.length} images selected</p>
              )}
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(4)} className="flex-1 bg-slate-100 text-slate-900 font-black py-4 rounded-xl hover:bg-slate-200 transition-colors">← Back</button>
                <button type="submit" disabled={loading} className="flex-[2] bg-green-500 text-white font-black py-4 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200 disabled:opacity-50">
                  {loading ? 'Uploading & Posting...' : 'Post Property Now ✨'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
