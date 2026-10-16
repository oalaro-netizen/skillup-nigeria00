import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, GraduationCap, BookOpen, User, ArrowRight } from 'lucide-react';
import axios from 'axios';
import logoImg from '../assets/skillup-logo.png';

function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [enrollError, setEnrollError] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { navigate('/login'); return; }
    try {
      const parsed = JSON.parse(u);
      if (parsed.role !== 'STUDENT') { navigate('/'); return; }
      setUser(parsed);
    } catch { navigate('/login'); }
  }, [navigate]);

  useEffect(() => {
    setLoadingEnrollments(true); setEnrollError('');
    axios.get('http://localhost:5000/api/courses/enrollments/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(r => { if (r.data?.success) setEnrollments(r.data.data || []); else setEnrollError('Failed to load'); })
      .catch(() => setEnrollError('Could not connect'))
      .finally(() => setLoadingEnrollments(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#EAF6EF] flex flex-col">
      <header className="bg-white border-b border-[#e5f7f0] shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="SkillUp Nigeria" className="w-10 h-10 object-contain" />
            <span className="text-xl font-extrabold text-heading tracking-tight">SkillUp Nigeria</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-body">
            <Link to="/student-dashboard" className="text-[#008751]">Dashboard</Link>
            <Link to="/catalogue" className="hover:text-[#008751]">Explore Courses</Link>
            <Link to="/my-learning" className="hover:text-[#008751]">My Learning</Link>
            <Link to="/dashboard" className="hover:text-[#008751]">Profile</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-[#e5f7f0]/60 p-8 md:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">Welcome, {user.name}</h1>
              <p className="text-muted mt-1">Student Dashboard — explore, learn, and grow.</p>
            </div>
            <button onClick={handleLogout} className="btn-secondary px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow-sm"><LogOut size={16}/> Log out</button>
          </div>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-heading flex items-center gap-2"><BookOpen size={20} className="text-[#008751]"/> My Learning</h2>
              <Link to="/my-learning" className="text-sm text-[#008751] hover:underline">View all</Link>
            </div>
            {loadingEnrollments && (
              <div className="rounded-2xl bg-[#EAF6EF]/60 border border-[#008751]/10 p-6 text-center">Loading enrollments...</div>
            )}
            {enrollError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">{enrollError}</div>
            )}
            {!loadingEnrollments && !enrollError && enrollments.length === 0 && (
              <div className="rounded-2xl bg-[#EAF6EF]/60 border border-[#008751]/10 p-6 text-center space-y-3">
                <GraduationCap size={48} className="mx-auto text-[#008751]/40" />
                <h3 className="text-lg font-bold text-heading">No enrolled courses yet</h3>
                <p className="text-muted text-sm">You haven't enrolled in any courses. Explore available training to get started.</p>
                <Link to="/catalogue" className="inline-flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition text-sm"><ArrowRight size={16}/> Explore Courses</Link>
              </div>
            )}
            {!loadingEnrollments && !enrollError && enrollments.length > 0 && (
              <div className="space-y-3">
                {enrollments.slice(0, 3).map(e => (
                  <Link key={e.id} to={`/course/${e.courseId}`} className="block bg-white rounded-2xl border border-[#e5f7f0] p-4 hover:shadow-lg transition flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EAF6EF] flex items-center justify-center shrink-0"><GraduationCap size={24} className="text-[#008751]" /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-heading truncate">{e.course?.title || 'Course'}</h3>
                      <p className="text-sm text-muted">Enrolled {new Date(e.enrolledAt).toLocaleDateString()}</p>
                      <p className="text-sm font-medium text-[#008751] mt-1">Progress: {e.progressSummary?.completedLessons || 0} / {e.progressSummary?.totalLessons || 0} lessons</p>
                    </div>
                    <ArrowRight size={18} className="text-muted shrink-0" />
                  </Link>
                ))}
                {enrollments.length > 3 && (
                  <Link to="/my-learning" className="text-sm text-[#008751] hover:underline">+{enrollments.length - 3} more courses →</Link>
                )}
              </div>
            )}
          </section>

          <section className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-[#008751] to-[#007b4a] text-white p-5 shadow-lg">
              <h3 className="font-extrabold text-lg">Student</h3>
              <p className="text-white/90 text-sm mt-1">Your account is active and ready for vocational training.</p>
            </div>
            <div className="rounded-2xl bg-white border border-[#e5f7f0] p-5 shadow-sm">
              <h3 className="font-extrabold text-heading text-lg">Progress</h3>
              <p className="text-muted text-sm mt-1">Enroll in courses to begin tracking progress.</p>
            </div>
            <div className="rounded-2xl bg-white border border-[#e5f7f0] p-5 shadow-sm">
              <h3 className="font-extrabold text-heading text-lg">Profile</h3>
              <p className="text-muted text-sm mt-1"><Link to="/dashboard" className="text-[#008751] underline">Manage account details</Link></p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
