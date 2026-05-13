import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function PropertyDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentImg, setCurrentImg] = useState(0);

   const [enquiryData, setEnquiryData] = useState({ name: '', email: '', phone: '', message: '' });
   const [enquiryLoading, setEnquiryLoading] = useState(false);
   const [enquirySuccess, setEnquirySuccess] = useState(false);

   useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/properties/${slug}`);
        setP(res.data);
      } catch (err) {
        console.error('Failed to fetch property', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [slug]);

  const onEnquiryChange = e => setEnquiryData({ ...enquiryData, [e.target.name]: e.target.value });

  const handleEnquiry = async (e) => {
    e.preventDefault();
    setEnquiryLoading(true);
    try {
      await axios.post('http://localhost:5000/api/v1/leads', {
        propertyId: p._id,
        ...enquiryData
      });
      setEnquirySuccess(true);
    } catch (err) {
      alert('Failed to send enquiry');
    } finally {
      setEnquiryLoading(false);
    }
  };

  const nextImg = () => {
    if (p.media && p.media.length > 0) {
      setCurrentImg((currentImg + 1) % p.media.length);
    }
  };

  const prevImg = () => {
    if (p.media && p.media.length > 0) {
      setCurrentImg((currentImg - 1 + p.media.length) % p.media.length);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400">Loading Property...</div>;
  if (!p) return <div className="p-20 text-center font-black text-slate-400">Property not found</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-10">
      <div className="mb-12 relative group">
         {p.media && p.media.length > 0 ? (
           <div className="h-[600px] bg-slate-200 rounded-[48px] overflow-hidden relative">
              <img src={p.media[currentImg].url} alt={p.title} className="w-full h-full object-cover transition-opacity duration-500" />
              
              {p.media.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                    <span className="text-2xl font-black">←</span>
                  </button>
                  <button onClick={nextImg} className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                    <span className="text-2xl font-black">→</span>
                  </button>
                  
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {p.media.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImg ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}></div>
                    ))}
                  </div>

                  <div className="absolute top-8 right-8 bg-slate-900/40 backdrop-blur-md px-4 py-2 rounded-full text-white font-black text-xs">
                    {currentImg + 1} / {p.media.length}
                  </div>
                </>
              )}
           </div>
         ) : (
           <div className="h-[400px] bg-slate-100 rounded-[48px] flex items-center justify-center text-slate-400 font-bold border-4 border-dashed border-slate-200">
              No Images Available
           </div>
         )}
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
         <div className="flex-1">
            <h1 className="text-4xl font-black text-slate-900 mb-4">{p.title}</h1>
            <p className="text-xl font-bold text-slate-500 mb-8">{p.location?.locality}, {p.location?.city}</p>
            
            <div className="grid grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[32px] mb-12">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Price</p>
                  <p className="text-2xl font-black text-blue-600">₹{p.pricing?.amount}</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">BHK</p>
                  <p className="text-2xl font-black text-slate-900">{p.features?.bhk}</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Area</p>
                  <p className="text-2xl font-black text-slate-900">{p.features?.areaSqFt} sqft</p>
               </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-4">Description</h2>
            <p className="text-slate-600 font-medium whitespace-pre-wrap leading-relaxed mb-12">{p.description}</p>

            {p.amenities && p.amenities.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   {p.amenities.map(item => (
                      <div key={item} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl">
                         <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                         <span className="font-bold text-slate-700">{item}</span>
                      </div>
                   ))}
                </div>
              </div>
            )}
         </div>

         <div className="w-full lg:w-96 shrink-0">
            <div className="bg-slate-900 text-white p-8 rounded-[40px] sticky top-24">
               <h3 className="text-xl font-black mb-6">Contact Poster</h3>
               <div className="mb-8">
                  <p className="font-bold text-lg">{p.poster?.name}</p>
                  <p className="text-slate-400 text-sm">{p.poster?.email}</p>
               </div>
               
               {enquirySuccess ? (
                 <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center">
                    <p className="text-green-400 font-black mb-2">Enquiry Sent! ✨</p>
                    <p className="text-xs text-slate-400">The poster will contact you shortly.</p>
                 </div>
               ) : (
                 <form onSubmit={handleEnquiry} className="space-y-4">
                    <input type="text" name="name" placeholder="Your Name" required value={enquiryData.name} onChange={onEnquiryChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold outline-none focus:border-blue-600" />
                    <input type="email" name="email" placeholder="Email Address" required value={enquiryData.email} onChange={onEnquiryChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold outline-none focus:border-blue-600" />
                    <input type="tel" name="phone" placeholder="Phone Number" required value={enquiryData.phone} onChange={onEnquiryChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold outline-none focus:border-blue-600" />
                    <textarea name="message" placeholder="I'm interested in this property..." value={enquiryData.message} onChange={onEnquiryChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold outline-none focus:border-blue-600 min-h-[100px]"></textarea>
                    
                    <button type="submit" disabled={enquiryLoading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-500 transition-colors disabled:opacity-50">
                       {enquiryLoading ? 'Sending...' : 'Send Enquiry'}
                    </button>
                 </form>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
