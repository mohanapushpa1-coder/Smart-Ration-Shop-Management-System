import { MapPin, Package, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShopCard({ shop }) {
  const isShopOpen = shop.hasOwnProperty('isOpen') ? shop.isOpen : true;
  const userRole = localStorage.getItem('role');

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md border transition overflow-hidden ${isShopOpen ? 'border-gray-200' : 'border-red-100 opacity-90'}`}>
      <div className={`px-5 py-4 border-b flex justify-between items-center ${isShopOpen ? 'bg-gradient-to-r from-blue-50 to-green-50 border-gray-100' : 'bg-red-50 border-red-100'}`}>
        <h3 className="font-semibold text-lg text-gray-800 tracking-tight">{shop.name}</h3>
        {isShopOpen ? (
          <span className="bg-green-100 text-secondary text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Open</span>
        ) : (
          <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Closed</span>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-start mb-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
          <span>
            {shop.latitude.toFixed(4)}, {shop.longitude.toFixed(4)} 
            {shop.distance && <span className="block mt-0.5 text-xs text-secondary font-medium tracking-wide">{(shop.distance).toFixed(1)} km away</span>}
          </span>
        </div>

        {shop.openTime && shop.closeTime && (
          <div className="flex items-center mb-4 text-xs font-medium text-gray-500">
             <Clock className="w-3.5 h-3.5 mr-2" />
             {shop.openTime} - {shop.closeTime}
          </div>
        )}
        
        <div className="bg-gray-50 rounded-lg p-3 mb-5 border border-gray-100">
          <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5 mr-1.5" /> Current Stock
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className={`bg-white py-2 rounded shadow-sm border ${shop.stock?.rice > 0 ? 'border-gray-100' : 'border-red-200 bg-red-50 text-red-500'}`}>
              <span className="block text-sm font-bold">{shop.stock?.rice || 0}kg</span>
              <span className="text-[10px] uppercase">Rice</span>
            </div>
            <div className={`bg-white py-2 rounded shadow-sm border ${shop.stock?.wheat > 0 ? 'border-gray-100' : 'border-red-200 bg-red-50 text-red-500'}`}>
              <span className="block text-sm font-bold">{shop.stock?.wheat || 0}kg</span>
              <span className="text-[10px] uppercase">Wheat</span>
            </div>
            <div className={`bg-white py-2 rounded shadow-sm border ${shop.stock?.sugar > 0 ? 'border-gray-100' : 'border-red-200 bg-red-50 text-red-500'}`}>
              <span className="block text-sm font-bold">{shop.stock?.sugar || 0}kg</span>
              <span className="text-[10px] uppercase">Sugar</span>
            </div>
          </div>
        </div>
        
        <Link 
          to={isShopOpen ? `/book` : '#'} 
          state={{ shopId: shop._id, shopName: shop.name }} 
          className={`block w-full py-2.5 border-2 text-center font-medium rounded-lg transition ${
            isShopOpen ? 'bg-white border-primary text-primary hover:bg-primary hover:text-white' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={(e) => !isShopOpen && e.preventDefault()}
        >
          {isShopOpen ? 'Book Time Slot' : 'Currently Unavailable'}
        </Link>
        {userRole === 'admin' && (
          <Link 
            to={`/admin/shop/${shop._id}/bookings`}
            state={{ shopName: shop.name }}
            className="block w-full mt-2 py-2text-sm bg-purple-50 border border-purple-200 text-purple-700 text-center font-medium rounded-lg hover:bg-purple-100 transition"
          >
            Manage Bookings
          </Link>
        )}
      </div>
    </div>
  );
}
