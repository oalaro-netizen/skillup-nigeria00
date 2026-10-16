import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import logoImg from '../assets/skillup-logo.png';

function CourseCatalogue() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(r => { if (r.data?.success) setCourses(r.data.data || []); else setError('Failed to load courses'); })
      .catch(() => setError('Could not connect to server'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set();
    courses.forEach(c => c.category?.name && cats.add(c.category.name));
    return Array.from(cats);
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const q = query.toLowerCase();
      const matchText = !q || c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || c.instructor?.name?.toLowerCase().includes(q);
      const matchCat = !categoryFilter || c.category?.name === categoryFilter;
      return matchText && matchCat;
    });
  }, [courses, query, categoryFilter]);

  return (
    <div className="min-h-screen bg-[#EAF6EF]">
      <header className="bg-white border-b border-[#e5f7f0] shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="SkillUp Nigeria" className="w-10 h-10 object-contain" />
            <span className="text-xl font-extrabold text-heading tracking-tight">SkillUp Nigeria</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-body">
            <Link to="/" className="hover:text-[#008751]">Home</Link>
            <Link to="/student-dashboard" className="text-[#008751]">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">Explore Courses</h1>
          <p className="text-muted">Discover vocational training courses taught by experienced instructors.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search courses, instructors..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#008751]/40 shadow-sm" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="md:w-56 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#008751]/40 shadow-sm text-sm">
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading && <div className="text-center py-12 text-muted">Loading courses...</div>}
        {error && !loading && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-6 py-5 flex items-start gap-3 text-red-700">
            <AlertCircle size={22} />
            <div><h3 className="font-bold">Error</h3><p className="text-sm">{error}</p></div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-3xl bg-white border border-[#e5f7f0]/60 p-10 text-center shadow-xl space-y-3">
            <GraduationCap size={48} className="mx-auto text-[#008751]/30" />
            <h2 className="text-xl font-extrabold text-heading">No published courses yet</h2>
            <p className="text-muted">Courses are not currently available. Check back once instructors publish training.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <Link key={course.id} to={`/course/${course.id}`} className="group bg-white rounded-3xl shadow-lg border border-[#e5f7f0]/60 hover:shadow-2xl transition overflow-hidden flex flex-col">
                <div className="h-48 bg-gradient-to-br from-[#008751]/10 to-[#EAF6EF] flex items-center justify-center relative">
                  {course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" /> : <GraduationCap size={48} className="text-[#008751]/30" />}
                  <span className="absolute top-3 left-3 bg-[#008751] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">{course.level || 'BEGINNER'}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted font-medium">
                    {course.category?.name && <span className="bg-[#EAF6EF] text-[#008751] px-2 py-0.5 rounded-md">{course.category.name}</span>}
                    <span>•</span>
                    <span>{course.instructor?.name || 'Instructor'}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-heading leading-tight group-hover:text-[#008751] transition">{course.title}</h2>
                  <p className="text-muted text-sm line-clamp-3">{course.description || 'No description available.'}</p>
                  <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-semibold text-[#008751]">View details <ArrowRight size={16} /></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CourseCatalogue;
