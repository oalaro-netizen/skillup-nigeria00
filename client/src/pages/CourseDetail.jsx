import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, GraduationCap } from 'lucide-react';
import axios from 'axios';
import logoImg from '../assets/skillup-logo.png';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState('');

  useEffect(() => {
    setLoading(true); setError(''); setEnrollMsg('');
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then(r => { if (r.data?.success) setCourse(r.data.data); else setError('Course not found'); })
      .catch(() => setError('Failed to load course'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true); setEnrollMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/courses/enroll', { courseId: id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
      });
      if (res.data?.success) setEnrollMsg('Enrolled successfully');
      else setEnrollMsg(res.data?.message || 'Enrollment failed');
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed';
      if (err.response?.status === 409) setEnrollMsg('Already enrolled');
      else if (err.response?.status === 401) setEnrollMsg('Please log in as a student');
      else setEnrollMsg(msg);
    } finally { setEnrolling(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#EAF6EF] p-10 text-center">Loading course...</div>;
  if (error || !course) return <div className="min-h-screen bg-[#EAF6EF] p-10"><div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-10 text-center space-y-4"><AlertCircle className="mx-auto text-red-500" size={40} /><h2 className="text-2xl font-extrabold text-heading">Course unavailable</h2><p className="text-muted">{error || 'This course does not exist or is not published.'}</p><Link to="/catalogue" className="inline-block btn-primary px-6 py-2.5 rounded-xl">Back to catalogue</Link></div></div>;

  return (
    <div className="min-h-screen bg-[#EAF6EF]">
      <header className="bg-white border-b border-[#e5f7f0] shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3"><img src={logoImg} alt="SkillUp" className="w-10 h-10 object-contain" /><span className="text-xl font-extrabold text-heading tracking-tight">SkillUp Nigeria</span></Link>
          <nav className="flex items-center gap-4 text-sm font-medium"><Link to="/catalogue" className="text-[#008751]">Catalogue</Link><Link to="/student-dashboard" className="hover:text-[#008751]">Dashboard</Link></nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <Link to="/catalogue" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-[#008751]"><ArrowLeft size={16}/> Back to catalogue</Link>
        <div className="bg-white rounded-3xl shadow-2xl border border-[#e5f7f0]/60 overflow-hidden">
          <div className="h-72 bg-gradient-to-tr from-[#008751] via-[#007b4a] to-[#006a3f] relative flex items-end p-8 md:p-10">
            <div className="relative z-10 text-white space-y-3">
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">{course.category?.name || 'Course'} • {course.level || 'BEGINNER'}</span>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">{course.title}</h1>
              <p className="text-white/90 font-medium">Instructor: {course.instructor?.name || 'Unknown'}</p>
            </div>
          </div>
          <div className="p-8 md:p-10 space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-xl font-extrabold text-heading">About</h2>
                <p className="text-body leading-relaxed">{course.description || 'No description available.'}</p>
                {course.learningOutcomes && <div><h3 className="font-bold text-heading">Learning Outcomes</h3><p className="text-muted text-sm">{course.learningOutcomes}</p></div>}
              </div>
              <div className="bg-[#EAF6EF]/60 rounded-2xl p-6 space-y-4 h-fit border border-[#008751]/10">
                <div><span className="text-xs font-bold text-muted uppercase tracking-wider">Level</span><p className="font-bold text-heading">{course.level || 'BEGINNER'}</p></div>
                <div><span className="text-xs font-bold text-muted uppercase tracking-wider">Duration</span><p className="font-bold text-heading">{course.duration || 'Flexible'}</p></div>
                <button onClick={handleEnroll} disabled={enrolling} className="btn-primary w-full py-3 rounded-xl shadow-md hover:shadow-xl transition font-bold">{enrolling ? 'Enrolling...' : 'Enroll Now'}</button>
                {enrollMsg && <p className="text-sm font-medium text-center text-[#008751]">{enrollMsg}</p>}
              </div>
            </div>

            <hr className="border-[#e5f7f0]" />

            <section>
              <h2 className="text-xl font-extrabold text-heading mb-4">Lessons</h2>
              {course.lessons && course.lessons.length > 0 ? (
                <div className="divide-y divide-[#e5f7f0] border border-[#e5f7f0] rounded-2xl overflow-hidden">
                  {course.lessons.map((l, i) => (
                    <div key={l.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#EAF6EF]/40 transition">
                      <span className="w-8 h-8 rounded-full bg-[#008751] text-white flex items-center justify-center text-sm font-extrabold shadow">{i + 1}</span>
                      <div className="flex-1"><h3 className="font-bold text-heading">{l.title}</h3><p className="text-xs text-muted">Order {l.order}{l.duration ? ` • ${l.duration}` : ''}</p></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#EAF6EF]/40 border border-[#e5f7f0] p-6 text-center text-muted">No lessons published yet.</div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourseDetail;
