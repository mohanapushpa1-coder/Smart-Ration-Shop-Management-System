import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addShop, getMyShop, updateShopStatus, updateShopStock, addNotification } from '../services/api';
import Layout from '../components/Layout';
import { MapPin, Package, Store, Box, BellRing, Settings, ClipboardList } from 'lucide-react';

export default function AddShop() {
  const [myShop, setMyShop] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', latitude: '', longitude: '',
    stock: { rice: '', wheat: '', sugar: '' }
  });
  
  const [updateData, setUpdateData] = useState({
    isOpen: true, openTime: '09:00 AM', closeTime: '06:00 PM',
    stock: { rice: 0, wheat: 0, sugar: 0 }
  });

  const [noteData, setNoteData] = useState({ announcement: '' });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('register'); // register, update, announce

  useEffect(() => {
    fetchMyShop();
  }, []);

  const fetchMyShop = async () => {
    try {
      const res = await getMyShop();
      if (res.data) {
        setMyShop(res.data);
        setUpdateData({
          isOpen: res.data.isOpen !== undefined ? res.data.isOpen : true,
          openTime: res.data.openTime || '09:00 AM',
          closeTime: res.data.closeTime || '06:00 PM',
          stock: { 
            rice: res.data.stock?.rice || 0, 
            wheat: res.data.stock?.wheat || 0, 
            sugar: res.data.stock?.sugar || 0 
          }
        });
        setNoteData({ announcement: res.data.announcement || '' });
        setTab('update');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterShop = async (e) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      if (myShop) {
        setError('You already have a registered shop');
        return;
      }
      await addShop({
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        stock: {
          rice: parseInt(formData.stock.rice) || 0,
          wheat: parseInt(formData.stock.wheat) || 0,
          sugar: parseInt(formData.stock.sugar) || 0,
        }
      });
      setSuccess('Shop registered successfully!');
      setFormData({ name: '', latitude: '', longitude: '', stock: { rice: '', wheat: '', sugar: '' } });
      await fetchMyShop(); // Reload to fetch the newly created shop
    } catch (err) {
      setError(err.response?.data || 'Failed to add shop. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShop = async (e) => {
    e.preventDefault();
    if(!myShop) return setError('You do not own a shop yet');
    setLoading(true); setSuccess(''); setError('');
    try {
      await updateShopStatus(myShop._id, { isOpen: updateData.isOpen, openTime: updateData.openTime, closeTime: updateData.closeTime });
      await updateShopStock(myShop._id, { stock: updateData.stock });
      setSuccess('Shop settings and stock updated successfully!');
    } catch(err) {
      setError('Failed to update shop.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostNotification = async (e) => {
    e.preventDefault();
    if(!myShop) return setError('You do not own a shop yet');
    setLoading(true); setSuccess(''); setError('');
    try {
      await addNotification(myShop._id, { announcement: noteData.announcement });
      setSuccess('Government update broadcasted successfully to your shop!');
      setNoteData({ announcement: noteData.announcement });
      
      // Update local context
      setMyShop({...myShop, announcement: noteData.announcement });
    } catch (err) {
      setError('Failed to broadcast update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-4">
        
        <div className="flex bg-gray-50 p-2 rounded-xl border border-gray-200 mb-8">
          <button onClick={()=>setTab('register')} className={`flex-1 flex justify-center items-center py-2 text-sm font-medium rounded-lg transition ${tab==='register' ? 'bg-white shadow border border-gray-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}>
             <Store className="w-4 h-4 mr-2" /> Register Shop
          </button>
          <button onClick={()=>setTab('update')} className={`flex-1 flex justify-center items-center py-2 text-sm font-medium rounded-lg transition ${tab==='update' ? 'bg-white shadow border border-gray-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>
             <Settings className="w-4 h-4 mr-2" /> Update Shop
          </button>
          <button onClick={()=>setTab('announce')} className={`flex-1 flex justify-center items-center py-2 text-sm font-medium rounded-lg transition ${tab==='announce' ? 'bg-white shadow border border-gray-100 text-amber-700' : 'text-gray-500 hover:bg-gray-100'}`}>
             <BellRing className="w-4 h-4 mr-2" /> Broadcast
          </button>
        </div>

        <div className="flex items-center mb-6 border-b pb-4">
          {tab === 'register' && <div className="bg-purple-100 p-2.5 rounded-lg mr-4"><Store className="w-6 h-6 text-purple-600" /></div>}
          {tab === 'update' && <div className="bg-blue-100 p-2.5 rounded-lg mr-4"><Settings className="w-6 h-6 text-blue-600" /></div>}
          {tab === 'announce' && <div className="bg-amber-100 p-2.5 rounded-lg mr-4"><BellRing className="w-6 h-6 text-amber-600" /></div>}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {tab === 'register' && 'Register New Shop'}
              {tab === 'update' && 'Update Existing Shop'}
              {tab === 'announce' && 'Official Broadcasts'}
            </h1>
            <p className="text-sm text-gray-500">Admin portal privileges</p>
          </div>
        </div>

        {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 border border-green-100 font-medium animate-in fade-in">{success}</div>}
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 font-medium animate-in fade-in">{error}</div>}

        {tab === 'register' && (
          myShop ? (
            <div className="bg-purple-50 text-purple-800 p-6 rounded-xl text-center font-medium border border-purple-100">
              You already have a registered shop. Active Management: <br/> 
              <span className="font-bold text-xl italic mt-2 block">{myShop.name}</span>
            </div>
          ) : (
            <form onSubmit={handleRegisterShop} className="space-y-6 animate-in fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Name</label>
                <input type="text" required value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition" placeholder="e.g. Central Ration Depot" />
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h3 className="flex items-center text-sm font-bold text-gray-700 uppercase tracking-wider mb-4"><MapPin className="w-4 h-4 mr-2" /> Location Coordinates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
                    <input type="number" step="any" required value={formData.latitude} onChange={(e)=>setFormData({...formData, latitude: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition" placeholder="13.0827" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
                    <input type="number" step="any" required value={formData.longitude} onChange={(e)=>setFormData({...formData, longitude: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition" placeholder="80.2707" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h3 className="flex items-center text-sm font-bold text-gray-700 uppercase tracking-wider mb-4"><Package className="w-4 h-4 mr-2" /> Initial Stock (kg)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Rice</label>
                    <input type="number" required min="0" value={formData.stock.rice} onChange={(e)=>setFormData({...formData, stock: {...formData.stock, rice: e.target.value}})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Wheat</label>
                    <input type="number" required min="0" value={formData.stock.wheat} onChange={(e)=>setFormData({...formData, stock: {...formData.stock, wheat: e.target.value}})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Sugar</label>
                    <input type="number" required min="0" value={formData.stock.sugar} onChange={(e)=>setFormData({...formData, stock: {...formData.stock, sugar: e.target.value}})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition" placeholder="0" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? 'Registering...' : 'Register Shop Database Entry'}
              </button>
            </form>
          )
        )}

        {tab === 'update' && (
          <form onSubmit={handleUpdateShop} className="space-y-6 animate-in fade-in">
            {myShop ? (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg font-bold flex items-center shadow-sm">
                <Store className="w-5 h-5 mr-3 text-blue-500" />
                Your Shop: <span className="ml-2 underline">{myShop.name}</span>
              </div>
            ) : (
                <div className="text-gray-500 p-4 text-center border rounded-lg bg-gray-50">Create a shop first in the Registration Tab!</div>
            )}

            {myShop && (
              <>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h3 className="flex items-center text-sm font-bold text-gray-700 uppercase tracking-wider mb-4"><Settings className="w-4 h-4 mr-2" /> Live Status</h3>
                  <div className="flex items-center mb-4 bg-white p-3 rounded border border-gray-200">
                    <input type="checkbox" id="isOpenId" checked={updateData.isOpen} onChange={(e)=>setUpdateData({...updateData, isOpen: e.target.checked})} className="w-5 h-5 text-blue-600 rounded bg-gray-100 border-gray-300 cursor-pointer focus:ring-blue-500" />
                    <label htmlFor="isOpenId" className="ml-2 text-sm font-semibold text-gray-800 cursor-pointer">Shop is Currently Open</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Opening Time</label>
                      <input type="text" required value={updateData.openTime} onChange={(e)=>setUpdateData({...updateData, openTime: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="09:00 AM" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Closing Time</label>
                      <input type="text" required value={updateData.closeTime} onChange={(e)=>setUpdateData({...updateData, closeTime: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="06:00 PM" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h3 className="flex items-center text-sm font-bold text-gray-700 uppercase tracking-wider mb-4"><Box className="w-4 h-4 mr-2" /> Modify Stock (kg)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rice</label>
                      <input type="number" required min="0" value={updateData.stock.rice} onChange={(e)=>setUpdateData({...updateData, stock: {...updateData.stock, rice: parseInt(e.target.value)}})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Wheat</label>
                      <input type="number" required min="0" value={updateData.stock.wheat} onChange={(e)=>setUpdateData({...updateData, stock: {...updateData.stock, wheat: parseInt(e.target.value)}})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Sugar</label>
                      <input type="number" required min="0" value={updateData.stock.sugar} onChange={(e)=>setUpdateData({...updateData, stock: {...updateData.stock, sugar: parseInt(e.target.value)}})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Saving...' : 'Save Operations Update'}
                </button>

                <div className="pt-6 border-t border-gray-200 mt-6">
                  <h3 className="flex items-center text-sm font-bold text-gray-700 uppercase tracking-wider mb-4"><ClipboardList className="w-4 h-4 mr-2" /> Daily Fulfillment Operations</h3>
                  <p className="text-sm text-gray-500 mb-4">Review incoming user reservations and clear collected rations to dynamically balance your stock limits.</p>
                  <Link to={`/admin/shop/${myShop._id}/bookings`} className="w-full flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 font-bold py-3 rounded-xl transition shadow-sm border border-green-200">
                    <ClipboardList className="w-5 h-5 mr-2" /> Manage Open Bookings
                  </Link>
                </div>
              </>
            )}
          </form>
        )}

        {tab === 'announce' && (
          <form onSubmit={handlePostNotification} className="space-y-6 animate-in fade-in">
             {myShop ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg font-bold flex items-center shadow-sm">
                <BellRing className="w-5 h-5 mr-3 text-amber-500" />
                Target Shop: <span className="ml-2 underline">{myShop.name}</span>
              </div>
            ) : (
                <div className="text-gray-500 p-4 text-center border rounded-lg bg-gray-50">Create a shop first in the Registration Tab!</div>
            )}
            
            {myShop && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Shop Front Announcement</label>
                  <textarea required value={noteData.announcement} onChange={(e)=>setNoteData({...noteData, announcement: e.target.value})} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-none" placeholder="Enter message to display on the global shop board..."></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
                   {loading ? 'Publishing...' : 'Publish Update directly to Shop'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </Layout>
  );
}
