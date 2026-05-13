import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  intent: 'BUY' | 'RENT';
  segment: 'RESIDENTIAL' | 'COMMERCIAL';
  status: string;
  location: {
    city: string;
    locality: string;
    addressLine1: string;
  };
  pricing: {
    amount: number;
    currency: string;
  };
  features: {
    bhk?: number;
    areaSqFt: number;
    furnishing?: string;
  };
  media: Array<{ url: string; isHero: boolean }>;
  amenities: string[];
  poster?: {
    name: string;
    posterType: string;
  };
  createdAt: string;
}

export interface ListResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export const fetchProperties = async (params: any = {}) => {
  const { data } = await api.get<ListResponse<Property>>('/properties', { params });
  return data;
};

export const fetchProperty = async (slug: string) => {
  const { data } = await api.get<{ success: boolean; data: Property }>(`/properties/${slug}`);
  return data.data;
};

export const submitEnquiry = async (enquiry: any) => {
  const { data } = await api.post('/leads', enquiry);
  return data;
};

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default api;
