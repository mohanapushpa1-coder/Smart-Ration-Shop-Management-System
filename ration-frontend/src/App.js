import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Shops from './pages/Shops';
import AddShop from './pages/AddShop';
import BookSlot from './pages/BookSlot';
import BookingHistory from './pages/BookingHistory';
import AdminBookings from './pages/AdminBookings';

const ProtectedRoute = ({ children }) => {
  const userRole = localStorage.getItem('role');
  return userRole === 'user' ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const userRole = localStorage.getItem('role');
  return userRole === 'admin' ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login isAdminRoute={false} />} />
        <Route path="/admin-login" element={<Login isAdminRoute={true} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/shops" element={<ProtectedRoute><Shops /></ProtectedRoute>} />
        <Route path="/book" element={<ProtectedRoute><BookSlot /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AddShop /></AdminRoute>} />
        <Route path="/admin/shop/:shopId/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
