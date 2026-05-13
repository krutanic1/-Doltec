'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const postSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  intent: z.enum(['BUY', 'RENT']),
  segment: z.enum(['RESIDENTIAL', 'COMMERCIAL']),
  location: z.object({
    addressLine1: z.string().min(5),
    locality: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().length(6),
  }),
  pricing: z.object({
    amount: z.number().min(1000),
    isNegotiable: z.boolean().default(false),
  }),
  features: z.object({
    bhk: z.number().optional(),
    areaSqFt: z.number().min(100),
    furnishing: z.string().optional(),
  }),
  amenities: z.array(z.string()).optional(),
});

type PostForm = z.infer<typeof postSchema>;

const STEPS = [
  { id: 1, title: 'Basic Info', desc: 'Listing type & title' },
  { id: 2, title: 'Location', desc: 'Where is it located?' },
  { id: 3, title: 'Property Details', desc: 'Area, BHK & Furnishing' },
  { id: 4, title: 'Pricing', desc: 'Expected price & terms' },
  { id: 5, title: 'Review', desc: 'Check and submit' },
];

export default function PostPropertyPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, trigger, setValue } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      intent: 'BUY',
      segment: 'RESIDENTIAL',
      amenities: [],
    }
  });

  const formData = watch();

  const nextStep = async () => {
    let fields: any[] = [];
    if (step === 1) fields = ['title', 'description', 'intent', 'segment'];
    if (step === 2) fields = ['location.addressLine1', 'location.locality', 'location.city', 'location.pincode'];
    if (step === 3) fields = ['features.areaSqFt', 'features.bhk'];
    if (step === 4) fields = ['pricing.amount'];

    const isValid = await trigger(fields);
    if (isValid) setStep(s => s + 1);
  };

  const onSubmit = async (data: PostForm) => {
    setLoading(true);
    try {
      await api.post('/properties', data);
      router.push('/dashboard?message=Property submitted for approval');
    } catch (err) {
      console.error(err);
      alert('Error creating property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12 flex gap-12">
        
        {/* Progress Sidebar */}
        <aside className="w-80 shrink-0 space-y-4">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 sticky top-24">
            <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Post Property</h2>
            <div className="space-y-8">
              {STEPS.map(s => (
                <div key={s.id} className="flex gap-4">
                  <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all',
                    step === s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 
                    step > s.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400')}>
                    {step > s.id ? '✓' : s.id}
                  </div>
                  <div>
                    <p className={clsx('text-xs font-black uppercase tracking-widest', step === s.id ? 'text-slate-900' : 'text-slate-400')}>{s.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Form Area */}
        <main className="flex-grow">
          <div className="bg-white border border-slate-200 rounded-[48px] p-16 shadow-sm min-h-[600px] flex flex-col">
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex-grow">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex gap-4">
                    {['BUY', 'RENT'].map(i => (
                      <button key={i} type="button" onClick={() => setValue('intent', i as any)}
                        className={clsx('flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all',
                          formData.intent === i ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400')}>
                        {i === 'BUY' ? 'Sell' : 'Rent'}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    {['RESIDENTIAL', 'COMMERCIAL'].map(s => (
                      <button key={s} type="button" onClick={() => setValue('segment', s as any)}
                        className={clsx('flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all',
                          formData.segment === s ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-400')}>
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Property Title</label>
                       <input {...register('title')} placeholder="e.g. Luxurious 3BHK Apartment in Whitefield" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-600 font-bold text-lg" />
                       {errors.title && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
                       <textarea {...register('description')} rows={5} placeholder="Describe the property, vicinity, and key highlights..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-600 font-bold text-base resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Location Details</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Address Line 1</label>
                       <input {...register('location.addressLine1')} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-600 font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Locality</label>
                       <input {...register('location.locality')} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-600 font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">City</label>
                       <input {...register('location.city')} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 outline-none focus:border-blue-600 font-bold" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="bg-blue-50 border border-blue-100 p-10 rounded-[32px] text-center">
                      <p className="text-4xl mb-4">🚀</p>
                      <h3 className="text-xl font-black text-blue-900 mb-2">Almost there!</h3>
                      <p className="text-blue-700/70 font-medium">Please review your property details. Once submitted, it will be sent to our moderation team for approval.</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-12 px-8">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Basic Info</p>
                         <p className="font-black text-slate-900 text-lg leading-tight">{formData.title}</p>
                         <p className="text-sm font-bold text-slate-500 mt-2">{formData.intent} · {formData.segment}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</p>
                         <p className="font-black text-slate-900 text-lg leading-tight">{formData.location.locality}, {formData.location.city}</p>
                      </div>
                   </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-16 pt-10 border-t border-slate-100 flex justify-between">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(s => s - 1)} className="px-10 py-5 rounded-2xl font-black text-sm text-slate-500 hover:bg-slate-50 transition-all">
                    Back
                  </button>
                )}
                {step < 5 ? (
                  <button type="button" onClick={nextStep} className="ml-auto bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                    Continue →
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="ml-auto bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-200">
                    {loading ? 'Submitting...' : 'Submit Listing'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
