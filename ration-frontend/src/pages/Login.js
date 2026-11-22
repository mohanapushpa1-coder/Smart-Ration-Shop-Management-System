import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import Layout from '../components/Layout';
import { LogIn } from 'lucide-react';

export default function Login({ isAdminRoute = false }) {
  const [rationCardNumber, setRationCardNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const targetRole = isAdminRoute ? 'admin' : 'user';
      const res = await loginUser({ rationCardNumber, password, role: targetRole });

      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('userEmail', rationCardNumber);
        localStorage.setItem('userName', res.data.name || (isAdminRoute ? "Admin" : "User"));
        navigate(isAdminRoute ? '/admin' : '/');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
       if (err.response && (err.response.status === 401 || err.response.status === 403)) {
         setError(err.response.data || 'Invalid credentials');
       } else {
         setError('Error connecting to the server. Is the backend running?');
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-100 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full mb-3">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isAdminRoute ? 'Admin Portal Login' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isAdminRoute ? 'Strictly for authorized officials' : 'Login to book your slots'}
          </p>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md mb-4">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ration Card Number</label>
            <input type="text" required value={rationCardNumber} onChange={(e)=>setRationCardNumber(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" placeholder="Enter your ration card number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition shadow disabled:opacity-70">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        {!isAdminRoute && (
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register here</Link>
          </p>
        )}
      </div>
    </Layout>
  );
}
