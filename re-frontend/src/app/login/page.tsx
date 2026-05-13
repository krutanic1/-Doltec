'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const message = searchParams.get('message');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', data);
      // Store token in cookie/localStorage (simplified for now)
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      const role = res.data.user.role;
      if (role === 'ADMIN') router.push('/admin');
      else if (role !== 'USER') router.push('/dashboard');
      else router.push('/');
      
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Login to your account to continue.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {message && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-xs font-bold border border-green-100">{message}</div>}
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold border border-red-100">{error}</div>}

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">Email Address</label>
          <input {...register('email')} placeholder="name@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors font-bold text-sm" />
          {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 px-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
            <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot?</Link>
          </div>
          <input {...register('password')} type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors font-bold text-sm" />
          {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all mt-4">
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>

        <p className="text-center text-xs font-bold text-slate-400 mt-8">
          Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Create one for free</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
