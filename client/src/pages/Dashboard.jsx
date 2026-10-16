import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, BookOpen, Settings } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { navigate('/login'); return; }
    try { setUser(JSON.parse(u)); } catch { navigate('/login'); }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  if (!user) return null;

  const role = user.role;
  const roleLabel = role === 'ADMIN' ? 'Admin' : role === 'INSTRUCTOR' ? 'Instructor' : 'Student';
  const roleColor = role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : role === 'INSTRUCTOR' ? 'bg-blue-100 text-blue-700' : 'bg-[#EAF6EF] text-[#008751]';

  return (
    <div className="container-page relative overflow-hidden min-h-screen py-12">
      <div className="relative z-10 card w-full max-w-3xl space-y-6 bg-white/95 backdrop-blur border border-[#e5f7f0] shadow-xl rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#EAF6EF] flex items-center justify-center">
              <User size={28} className="text-[#008751]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-heading">{user.name}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${roleColor}`}>{roleLabel}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
        
        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-heading mb-4">Account Overview</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-gray-50"><p className="text-sm text-muted">Email</p><p className="font-medium text-body">{user.email}</p></div>
            <div className="p-4 rounded-lg bg-gray-50"><p className="text-sm text-muted">Account Status</p><p className="font-medium text-[#008751]">Active</p></div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-heading mb-4">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/courses" className="p-4 rounded-lg border border-gray-200 hover:border-[#008751] hover:bg-[#EAF6EF] transition-colors flex items-center gap-3">
              <BookOpen size={24} className="text-[#008751]" />
              <span className="font-medium text-body">Browse Courses</span>
            </Link>
            <Link to="/instructor/courses" className="p-4 rounded-lg border border-gray-200 hover:border-[#008751] hover:bg-[#EAF6EF] transition-colors flex items-center gap-3">
              <Shield size={24} className="text-[#008751]" />
              <span className="font-medium text-body">Manage Courses</span>
            </Link>
            <Link to="/admin/users" className="p-4 rounded-lg border border-gray-200 hover:border-[#008751] hover:bg-[#EAF6EF] transition-colors flex items-center gap-3">
              <Shield size={24} className="text-[#008751]" />
              <span className="font-medium text-body">Admin: Users</span>
            </Link>
            <Link to="/settings" className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-3">
              <Settings size={24} className="text-muted" />
              <span className="font-medium text-body">Settings</span>
            </Link>
          </div>
        </div>

        <p className="text-sm text-muted text-center pt-4 border-t border-gray-100">
          Note: Course, Instructor, and Admin dashboards are placeholders for upcoming implementation.
        </p>
      </div>
    </div>
  );
}
export default Dashboard;