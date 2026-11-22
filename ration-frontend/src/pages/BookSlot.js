import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookSlot, getShopSlots } from '../services/api';
import Layout from '../components/Layout';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function BookSlot() {
  const location = useLocation();
  const navigate = useNavigate();
  const shopId = location.state?.shopId || '';
  const shopName = location.state?.shopName || 'Unknown Shop';
  
  const [date, setDate] = useState('');
  const [hourSlot, setHourSlot] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  const hourSlots = ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM"];

  useEffect(() => {
    if (date && shopId) {
      getShopSlots(shopId, date).then(res => {
        setBookedSlots(res.data);
      }).catch(err => console.error(err));
      setHourSlot('');
      setTime('');
    }
  }, [date, shopId]);

  const generateMiniSlots = () => {
    if(!hourSlot) return [];
    const baseHour = parseInt(hourSlot.substring(0,2));
    const isPM = hourSlot.includes('PM') && baseHour !== 12;
    let hour24 = baseHour + (isPM ? 12 : 0);
    // special case for 01:00 PM, baseHour=1, isPM=true, hour24=13
    
    let slots = [];
    for (let i = 0; i < 60; i += 5) {
      const minStr = i.toString().padStart(2, '0');
      const hrStr = baseHour.toString().padStart(2, '0');
      slots.push(`${hrStr}:${minStr} ${hourSlot.includes('PM') && baseHour !== 12 && baseHour !== 11 ? 'PM' : (baseHour===11||baseHour===12) ? hourSlot.split(' ')[1] : 'AM'}`);
    }
    return slots;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if(!date || !hourSlot || !time) return;
    
    setLoading(true);
    try {
      const email = localStorage.getItem('userEmail') || 'guest_user';
      const res = await bookSlot({
        userId: email,
        shopId: shopId,
        slot: hourSlot,
        time: time,
        date: date
      });
      
      if (res.data.includes('already booked') || res.data === 'Slot full') {
        setMessage({ type: 'error', text: res.data });
      } else {
        setMessage({ type: 'success', text: `Slot booked successfully for ${date} at ${time}!` });
        const history = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
        history.push({ shopName, date, time, bookedAt: new Date().toISOString() });
        localStorage.setItem('bookingHistory', JSON.stringify(history));
        
        setTimeout(() => navigate('/history'), 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error connecting to the booking service.' });
    } finally {
      setLoading(false);
    }
  };

  if(!shopId) return <Layout><div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">Please select a shop first from the Shops page.</div></Layout>;

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Book Collection Slot</h1>
        <div className="flex items-center text-primary font-medium bg-blue-50 w-fit px-3 py-1.5 rounded-full mb-8 border border-blue-100">
          <MapPin className="w-4 h-4 mr-1.5" /> {shopName}
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 border font-medium duration-300 animate-in fade-in ${message.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-6">
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider"><Calendar className="w-4 h-4 mr-2" /> Select Date</label>
            <input 
              type="date" 
              required min={new Date().toISOString().split('T')[0]} 
              value={date} onChange={(e)=>setDate(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition shadow-sm bg-white" 
            />
          </div>

          {date && (
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider"><Clock className="w-4 h-4 mr-2" /> 1. Select Hour Slot</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hourSlots.map(slot => {
                  const hourCount = bookedSlots.filter(b => b.slot === slot).length;
                  const isFull = hourCount >= 15;
                  return (
                    <button
                      key={slot} type="button" onClick={() => { if(!isFull) { setHourSlot(slot); setTime(''); } }}
                      disabled={isFull}
                      className={`py-3 px-2 text-sm font-medium rounded-xl border transition ${isFull ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' : hourSlot === slot ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary shadow-sm'}`}
                    >
                      {slot}
                      {isFull && <span className="block text-xs font-bold mt-1 text-red-500 uppercase tracking-widest">Full</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {hourSlot && (
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider"><Clock className="w-4 h-4 mr-2" /> 2. Pick Mini-Slot</label>
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2">
                {generateMiniSlots().map(ms => {
                  const isBooked = bookedSlots.some(b => b.time === ms && b.slot === hourSlot);
                  return (
                    <button
                      key={ms} type="button" onClick={() => !isBooked && setTime(ms)}
                      disabled={isBooked}
                      title={ms}
                      className={`py-1.5 px-1 text-xs font-bold rounded-lg border transition ${isBooked ? 'bg-gray-200 border-gray-300 text-gray-400 line-through cursor-not-allowed opacity-60' : time === ms ? 'bg-green-600 text-white border-green-700 shadow-md transform scale-105' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 shadow-sm leading-tight'}`}
                    >
                      {ms.substring(0,5)}
                    </button>
                  );
                })}
              </div>
              {!time && <p className="text-xs text-amber-600 mt-3 font-medium bg-amber-50 p-2 rounded-lg border border-amber-100 inline-block">Please precisely pick a 5-minute mini slot.</p>}
            </div>
          )}

          <button type="submit" disabled={loading || !time} className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed mt-4 text-lg">
            {loading ? 'Processing Hold...' : 'Confirm Booked Slot'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
