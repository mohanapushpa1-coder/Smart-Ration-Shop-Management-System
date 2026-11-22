import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Store, CalendarClock, MapPin, Bell } from 'lucide-react';
import { getNotifications } from '../services/api';

export default function Dashboard() {
  const userName = localStorage.getItem("userName") || "Guest";
  const userRole = localStorage.getItem("role");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, []);

  return (
    <Layout>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 mt-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {userName}! 👋</h1>
        <p className="text-gray-600 text-lg">Book your ration slot effortlessly and track live availability of nearby shops.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <MapPin className="text-primary w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Find Shops</h3>
          <p className="text-gray-500 mb-4 text-sm">Locate nearby smart ration shops and check current availability of supplies.</p>
          <Link to="/shops" className="text-primary font-medium hover:underline flex items-center">View Shops &rarr;</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <CalendarClock className="text-secondary w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">My Bookings</h3>
          <p className="text-gray-500 mb-4 text-sm">Review your upcoming slot bookings and past ration collections.</p>
          <Link to="/history" className="text-secondary font-medium hover:underline flex items-center">Booking History &rarr;</Link>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-amber-100 p-2.5 rounded-lg mr-4 border border-amber-200">
              <Bell className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Government Updates</h2>
          </div>
          <div className="space-y-4">
            {notifications.map((note) => (
              <div key={note._id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-800">{note.title}</h4>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{new Date(note.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{note.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
