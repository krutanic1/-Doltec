import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditProperty() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '', description: '', intent: 'RENT', segment: 'RESIDENTIAL',
    price: '', city: '', locality: '', bhk: '', bathrooms: '', areaSqFt: '',
    amenities: []
  });
  const [existingMedia, setExistingMedia] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const commonAmenities = ["Parking", "Lift", "Security", "Gym", "Power Backup", "Swimming Pool", "Clubhouse", "Balcony", "Garden"];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/properties/${slug}`);
        const p = res.data;
        setFormData({
          title: p.title,
          description: p.description,
          intent: p.intent,
          segment: p.segment,
          price: p.pricing?.amount || '',
          city: p.location?.city || '',
          locality: p.location?.locality || '',
          bhk: p.features?.bhk || '',
          bathrooms: p.features?.bathrooms || '',
          areaSqFt: p.features?.areaSqFt || '',
          amenities: p.amenities || []
        });
        setExistingMedia(p.media || []);
      } catch (err) {
        console.error(err);
        alert('Failed to load property data');
      } finally {
        setFetching(false);
      }
    };
    fetchProperty();
  }, [slug]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) 
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      const propertyData = {
        title: formData.title,
        description: formData.description,
        intent: formData.intent,
        segment: formData.segment,
        pricing: { amount: Number(formData.price), currency: 'INR', isNegotiable: true },
        location: { city: formData.city, locality: formData.locality },
        features: {
          bhk: Number(formData.bhk),
          bathrooms: Number(formData.bathrooms),
          areaSqFt: Number(formData.areaSqFt)
        },
        amenities: formData.amenities,
        media: existingMedia // Preserve existing photos
      };

      formDataToSend.append('data', JSON.stringify(propertyData));
      selectedImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      // Use the existing PUT endpoint I created earlier
      await axios.put(`http://localhost:5000/api/v1/properties/${slug}`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      
      navigate('/real-estate/manage');
    } catch (err) {
      console.error(err);
      alert('Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center font-black text-slate-400">Loading Property Data...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-8">Edit Property Listing</h1>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Basic Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Intent</label>
                  <select name="intent" value={formData.intent} onChange={onChange} className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600">
                    <option value="RENT">For Rent</option>
                    <option value="BUY">For Sale</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Property Type</label>
                  <select name="segment" value={formData.segment} onChange={onChange} className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600">
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                <input type="text" name="title" value={formData.title} onChange={onChange} required className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600" />
              </div>
              <button type="button" onClick={() => setStep(2)} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-colors">Next: Location & Pricing →</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Location & Pricing</h2>
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
                <button type="button" onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-colors">Next: Features →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Features</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">BHK</label>
                  <input type="number" name="bhk" value={formData.bhk} onChange={onChange} required className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Baths</label>
                  <input type="number" name="bathrooms" value={formData.bathrooms} onChange={onChange} required className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Area</label>
                  <input type="number" name="areaSqFt" value={formData.areaSqFt} onChange={onChange} required className="w-full mt-1 bg-slate-50 p-4 rounded-xl font-bold outline-none border border-transparent focus:border-blue-600" />
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
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonAmenities.map(amenity => (
                  <label key={amenity} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.amenities.includes(amenity) ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                    <input type="checkbox" className="hidden" checked={formData.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                    <span className="font-bold text-sm">{amenity}</span>
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
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Manage Photos</h2>
              
              {existingMedia.length > 0 && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-500 uppercase">Existing Photos</p>
                  <div className="grid grid-cols-4 gap-3">
                    {existingMedia.map((media, i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-200 relative group">
                        <img src={media.url} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setExistingMedia(existingMedia.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-4 border-dashed border-slate-100 rounded-[40px] p-12 text-center mt-8">
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-5xl mb-4">📸</div>
                  <p className="text-slate-900 font-black text-xl mb-2">Add More Photos</p>
                  <p className="text-slate-500 font-medium">Select new photos to add to this listing</p>
                </label>
              </div>
              
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {selectedImages.map((img, i) => (
                    <div key={i} className="aspect-square bg-blue-50 rounded-xl flex items-center justify-center text-[10px] font-bold text-blue-400">New Image {i+1}</div>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(4)} className="flex-1 bg-slate-100 text-slate-900 font-black py-4 rounded-xl hover:bg-slate-200 transition-colors">← Back</button>
                <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50">
                  {loading ? 'Saving Changes...' : 'Save All Changes ✨'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
