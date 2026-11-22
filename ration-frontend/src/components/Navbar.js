import { Link, useNavigate } from 'react-router-dom';
import { Store, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    const wasAdmin = userRole === 'admin';
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate(wasAdmin ? "/admin-login" : "/login");
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Store className="h-7 w-7 text-primary" />
              </div>
              <span className="ml-3 font-bold text-xl text-gray-800 tracking-tight">Smart Ration</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {userName ? (
              <>
                {userRole === 'user' && (
                  <Link to="/shops" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Shops</Link>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Admin Portal</Link>
                )}
                <div className="hidden sm:flex items-center ml-4 space-x-2 border-l pl-4 border-gray-200">
                  <div className="bg-gray-100 p-1.5 rounded-full">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{userName}</span>
                  <button onClick={handleLogout} className="ml-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all title='Logout'">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-primary text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
