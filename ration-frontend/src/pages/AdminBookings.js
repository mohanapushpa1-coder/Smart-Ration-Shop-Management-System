import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getAdminBookings, verifyBooking } from '../services/api';
import Layout from '../components/Layout';
import { CheckCircle, Clock, CalendarDays, MapPin } from 'lucide-react';

export default function AdminBookings() {
  const { shopId } = useParams();
  const location = useLocation();
  const shopName = location.state?.shopName || "Ration Shop";
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [shopId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAdminBookings(shopId);
      // Sort to show pending first, then sort by date
      const sorted = res.data.sort((a, b) => {
        if (a.status === 'booked' && b.status === 'completed') return -1;
        if (a.status === 'completed' && b.status === 'booked') return 1;
        return new Date(a.date) - new Date(b.date);
      });
      setBookings(sorted);
    } catch (err) {
      setError('Failed to load bookings. Ensure you have admin access.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await verifyBooking(bookingId);
      // Update local state
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'completed', collectedAt: new Date().toISOString() } : b));
    } catch (err) {
      alert(err.response?.data || "Failed to verify booking");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
          <p className="flex items-center text-primary font-medium mt-1">
            <MapPin className="w-4 h-4 mr-1"/> {shopName}
          </p>
        </div>
        <Link to="/shops" className="text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
          Back to Shops
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 border border-red-100 font-medium">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
      ) : bookings.length > 0 ? (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm tracking-wide text-gray-600 uppercase">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {b.userId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <CalendarDays className="w-4 h-4 mr-2 text-gray-400"/> {b.date}
                      </div>
                      <div className="flex items-center text-sm font-semibold text-gray-800">
                        <Clock className="w-4 h-4 mr-2 text-blue-500"/> {b.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {b.status === 'completed' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none bg-green-100 text-green-700 uppercase">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none bg-amber-100 text-amber-700 uppercase">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {b.status === 'booked' ? (
                        <button
                          onClick={() => handleVerify(b._id)}
                          disabled={actionLoading === b._id}
                          className="bg-primary hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-4 items-center rounded flex transition disabled:opacity-50 shadow-sm mx-auto"
                        >
                          {actionLoading === b._id ? 'Processing...' : 'Mark as Collected'}
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-gray-400 flex flex-col items-center">
                          <span>Collected On</span>
                          <span>{b.collectedAt ? new Date(b.collectedAt).toLocaleDateString() : 'N/A'}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-lg">No bookings exist for this shop yet.</p>
        </div>
      )}
    </Layout>
  );
}
