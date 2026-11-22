import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { CalendarClock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BookingHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    setHistory(data.reverse());
  }, []);

  return (
    <Layout>
      <div className="flex items-center mb-8 border-b pb-4 mt-4">
        <div className="bg-green-100 p-2.5 rounded-lg mr-4 border border-green-200">
          <CalendarClock className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-sm text-gray-500">History of your ration collection slots</p>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="space-y-4 max-w-3xl">
          {history.map((booking, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-xl text-gray-800 tracking-tight">{booking.shopName}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-700">
                  <span className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">Date: <b>{booking.date}</b></span>
                  <span className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">Time: <b>{booking.time}</b></span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between bg-green-50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                <span className="flex items-center text-green-700 font-bold mb-1 text-sm bg-green-100 sm:bg-transparent px-2 py-1 rounded sm:p-0"><CheckCircle2 className="w-4 h-4 mr-1.5"/> Confirmed</span>
                <span className="text-xs text-gray-400 font-medium">Booked {new Date(booking.bookedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-200">
            <CalendarClock className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No bookings yet</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't booked any slots for ration collection. Find a nearby shop to grab a slot!</p>
          <Link to="/shops" className="bg-primary hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-xl transition shadow-md hover:shadow-lg">Find a Shop Now</Link>
        </div>
      )}
    </Layout>
  );
}
