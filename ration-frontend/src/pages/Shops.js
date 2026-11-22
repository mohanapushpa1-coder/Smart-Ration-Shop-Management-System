import { useState, useEffect } from 'react';
import { getShops, getShopsLoc } from '../services/api';
import Layout from '../components/Layout';
import ShopCard from '../components/ShopCard';
import { Search, MapPin } from 'lucide-react';

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [useLocation, setUseLocation] = useState(false);

  useEffect(() => {
    fetchShops();
  }, [useLocation]);

  const fetchShops = async () => {
    setLoading(true);
    try {
      if (useLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const res = await getShopsLoc(pos.coords.latitude, pos.coords.longitude);
            setShops(res.data);
            setLoading(false);
          },
          async (err) => {
            console.error("Geolocation failed, falling back to all shops", err);
            const res = await getShops();
            setShops(res.data);
            setLoading(false);
          }
        );
      } else {
        const res = await getShops();
        setShops(res.data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Nearby Ration Shops</h1>
          <p className="text-gray-500 mt-1">Find shops and check availability</p>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition">
            <input type="checkbox" checked={useLocation} onChange={(e) => setUseLocation(e.target.checked)} className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-primary"/> Sort Nearby</span>
          </label>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Search shops by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map(shop => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-lg">No shops found matching your search.</p>
        </div>
      )}
    </Layout>
  );
}
