import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, BookOpen, ArrowRight, GraduationCap } from 'lucide-react';
import axios from 'axios';
import logoImg from '../assets/skillup-logo.png';

function MyLearning() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses/enrollments/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(r => { if (r.data?.success) setEnrollments(r.data.data || []); else setError('Failed to load'); })
      .catch(() => setError('Could not connect'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { localStorage.clear(); window.location.href = '/login'; };

  return (
    <div className="min-h-screen bg-[#EAF6EF] flex flex-col">
      <header className="bg-white border-b border-[#e5f7f0] shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3"><img src={logoImg} alt="SkillUp" className="w-10 h-10 object-contain" /><span className="text-xl font-extrabold text-heading">SkillUp Nigeria</span></Link>
          <nav className="flex items-center gap-4 text-sm font-medium"><Link to="/catalogue" className="hover:text-[#008751]">Catalogue</Link><Link to="/student-dashboard" className="text-[#008751]">Dashboard</Link></nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-extrabold text-heading tracking-tight">My Learning</h1><p className="text-muted">Your enrolled courses and progress.</p></div>
          <button onClick={handleLogout} className="btn-secondary px-4 py-2 rounded-xl shadow-sm text-sm">Log out</button>
        </div>
        {loading && <div className="text-center py-10 text-muted">Loading enrollments...</div>}
        {error && <div className="rounded-xl bg-red-50 border border-red-200 px-6 py-4 text-red-700">{error}</div>}
        {!loading && !error && enrollments.length === 0 && (
          <div className="rounded-3xl bg-white border border-[#e5f7f0]/60 p-10 text-center shadow-xl space-y-3">
            <BookOpen size={48} className="mx-auto text-[#008751]/30" />
            <h2 className="text-xl font-extrabold text-heading">No enrollments yet</h2>
            <p className="text-muted">Enroll in a course to start learning.</p>
            <Link to="/catalogue" className="inline-flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl shadow-md"><ArrowRight size={16}/> Explore courses</Link>
          </div>
        )}
        {!loading && enrollments.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {enrollments.map(e => (
              <Link key={e.id} to={`/course/${e.courseId}`} className="bg-white rounded-3xl shadow-lg border border-[#e5f7f0]/60 p-6 hover:shadow-2xl transition">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#EAF6EF] flex items-center justify-center shrink-0"><GraduationCap size={28} className="text-[#008751]" /></div>
                  <div>
                    <h3 className="text-lg font-extrabold text-heading">{e.course?.title || 'Course'}</h3>
                    <p className="text-sm text-muted">Enrolled {new Date(e.enrolledAt).toLocaleDateString()}</p>
                    <p className="text-sm font-medium text-[#008751] mt-1">Progress: {e.progressSummary?.completedLessons || 0} / {e.progressSummary?.totalLessons || 0} lessons</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyLearning;
