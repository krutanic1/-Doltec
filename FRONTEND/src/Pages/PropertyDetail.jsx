import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function PropertyDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentImg, setCurrentImg] = useState(0);

   const [enquiryData, setEnquiryData] = useState({ name: '', email: '', phone: '', message: '' });
   const [enquiryLoading, setEnquiryLoading] = useState(false);
   const [enquirySuccess, setEnquirySuccess] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
    
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

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
    if (!user) return;

    setEnquiryLoading(true);
    try {
      await axios.post('http://localhost:5000/api/v1/leads', {
        propertyId: p._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        message: enquiryData.message
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEnquirySuccess(true);
      setIsModalOpen(false);
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
               
               {!user ? (
                 <div className="space-y-6">
                    <p className="text-slate-400 text-sm font-bold">Please log in as a buyer or tenant to send an enquiry for this property.</p>
                    <Link to="/real-estate/login" className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
                       Log In / Sign Up
                    </Link>
                 </div>
               ) : enquirySuccess ? (
                 <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center">
                    <p className="text-green-400 font-black mb-2">Enquiry Sent! ✨</p>
                    <p className="text-xs text-slate-400">The poster will contact you shortly at {user.email}.</p>
                 </div>
               ) : (
                 <button onClick={() => setIsModalOpen(true)} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3">
                    <span className="text-xl">📩</span> Send Enquiry
                 </button>
               )}

               {/* Enquiry Modal */}
               {isModalOpen && (
                 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                       <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                          <div>
                             <h4 className="text-xl font-black text-slate-900">Send Message</h4>
                             <p className="text-xs font-bold text-slate-400 mt-0.5">Contacting {p.poster?.name}</p>
                          </div>
                          <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">✕</button>
                       </div>
                       <form onSubmit={handleEnquiry} className="p-8 space-y-6">
                          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Your Details (Auto-filled)</p>
                             <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                   <span className="text-xs font-bold text-slate-900">{user.name}</span>
                                   <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                   <span className="text-xs font-medium text-slate-500">{user.phone}</span>
                                </div>
                                <p className="text-xs font-medium text-slate-500">{user.email}</p>
                             </div>
                          </div>
                          
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Your Message</label>
                             <textarea 
                                name="message" 
                                placeholder="Write your message here... (e.g., I'm interested in viewing this property this weekend)" 
                                required
                                value={enquiryData.message} 
                                onChange={onEnquiryChange} 
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-blue-600 min-h-[150px] transition-colors"
                             ></textarea>
                          </div>
                          
                          <button type="submit" disabled={enquiryLoading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-blue-200">
                             {enquiryLoading ? 'Sending...' : 'Confirm & Send Enquiry'}
                          </button>
                       </form>
                    </div>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
