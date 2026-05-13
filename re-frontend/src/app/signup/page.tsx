'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'OWNER', 'AGENT', 'BUILDER']),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'USER' }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', data);
      router.push('/login?message=Registration successful. Please login.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join the Doltec community today.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold border border-red-100">{error}</div>}
        
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">I am a</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Buyer/Tenant', val: 'USER' },
              { label: 'Owner', val: 'OWNER' },
              { label: 'Agent', val: 'AGENT' },
              { label: 'Builder', val: 'BUILDER' },
            ].map(r => (
              <label key={r.val} className={`cursor-pointer border-2 rounded-xl p-3 transition-all text-center ${
                selectedRole === r.val ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'
              }`}>
                <input type="radio" {...register('role')} value={r.val} className="hidden" />
                <span className={`text-[10px] font-black uppercase tracking-tight ${selectedRole === r.val ? 'text-blue-600' : 'text-slate-500'}`}>{r.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <input {...register('name')} placeholder="Full Name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors font-bold text-sm" />
          {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{errors.name.message}</p>}
        </div>

        <div>
          <input {...register('email')} placeholder="Email Address" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors font-bold text-sm" />
          {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{errors.email.message}</p>}
        </div>

        <div>
          <input {...register('phone')} placeholder="Phone Number" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors font-bold text-sm" />
          {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{errors.phone.message}</p>}
        </div>

        <div>
          <input {...register('password')} type="password" placeholder="Password" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors font-bold text-sm" />
          {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all mt-4">
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="text-center text-xs font-bold text-slate-400 mt-8">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
