import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import Layout from '../components/Layout';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', rationCardNumber: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.rationCardNumber);
      navigate('/');
    } catch (err) {
      setError('Error creating account. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8 bg-white p-8 border border-gray-100 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary/10 p-3 rounded-full mb-3">
            <UserPlus className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
          <p className="text-sm text-gray-500 mt-1">Get started securely</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md mb-4">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" required value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ration Card Number</label>
            <input type="text" required value={formData.rationCardNumber} onChange={(e)=>setFormData({...formData, rationCardNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition" placeholder="e.g. 123456789012" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secure Password</label>
            <input type="password" required value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full mt-2 bg-secondary hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition shadow disabled:opacity-70">
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-secondary font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </Layout>
  );
}
