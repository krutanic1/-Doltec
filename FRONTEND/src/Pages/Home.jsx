import { Link, useNavigate } from 'react-router-dom';
import PropertySearch from '../components/PropertySearch';

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = (data) => {
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/real-estate/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover brightness-[0.4]" alt="Luxury Home" />
        </div>
        
        <div className="relative z-10 w-full max-w-6xl px-6 text-center">
           <PropertySearch onSearch={handleSearch} />
        </div>
      </section>


    </div>
  );
}

