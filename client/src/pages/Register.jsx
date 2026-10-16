import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, CheckCircle, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import axios from 'axios';
import logoImg from '../assets/skillup-logo.png';

const ROLES = [
  { value: 'STUDENT', label: 'Student', description: 'Learn new skills and track your progress.', icon: '🎓' },
  { value: 'INSTRUCTOR', label: 'Tutor', description: 'Share your vocational expertise and guide learners.', icon: '👩‍🏫' },
];

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('All fields are required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!selectedRole) { setError('Please select a role (Student or Tutor)'); return; }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role: selectedRole });
      if (res.data && res.data.success) {
        setRegistered(true);
      } else {
        setError(res.data?.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#EAF6EF]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e5f7f0] p-8 text-center space-y-6">
          <img src={logoImg} alt="SkillUp Nigeria logo" className="w-16 h-16 object-contain mx-auto mb-2" />
          <CheckCircle className="mx-auto text-[#008751]" size={48} />
          <h2 className="text-2xl font-extrabold text-heading">Registration Successful</h2>
          <p className="text-body leading-relaxed">An email verification link has been generated. Check your inbox and verify to activate your account.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/verify-email" className="btn-primary px-6 py-2.5 rounded-lg shadow-md">Verify Email</Link>
            <Link to="/login" className="btn-secondary px-6 py-2.5 rounded-lg shadow-sm">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#EAF6EF]">
      {/* Left: form */}
      <div className="w-full md:w-[55%] lg:w-[58%] flex items-center justify-center px-6 md:px-14 lg:px-20 py-12 md:py-16">
        <div className="w-full max-w-md space-y-7 bg-white rounded-3xl shadow-2xl border border-[#e5f7f0]/60 p-8 md:p-10">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="SkillUp Nigeria logo" className="w-16 h-16 object-contain drop-shadow-sm" />
            <div>
              <h2 className="text-xl font-extrabold text-heading leading-tight tracking-tight">SkillUp Nigeria</h2>
              <p className="text-xs text-muted font-medium">Student & Instructor Platform</p>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-heading tracking-tight">Create Your Account</h1>
            <p className="text-base text-muted mt-1">Join SkillUp Nigeria and start your vocational journey.</p>
          </div>

          {/* Role selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-body">Select your role</label>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    selectedRole === role.value
                      ? 'border-[#008751] bg-[#EAF6EF]'
                      : 'border-gray-200 hover:border-[#008751]/50 hover:bg-[#EAF6EF]/30'
                  }`}
                  aria-pressed={selectedRole === role.value}
                  aria-label={role.label}
                >
                  <span className="text-3xl">{role.icon}</span>
                  <span className="font-semibold text-body text-center">{role.label}</span>
                  <span className="text-xs text-muted text-center">{role.description}</span>
                </button>
              ))}
            </div>
            {selectedRole && <p className="text-xs text-[#008751]">Selected: {ROLES.find((r) => r.value === selectedRole)?.label}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-semibold text-body">Full Name</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-body focus:outline-none focus:ring-2 focus:ring-[#008751]/40 focus:border-[#008751] transition shadow-sm" placeholder="Your full name" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-body">Email</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-body focus:outline-none focus:ring-2 focus:ring-[#008751]/40 focus:border-[#008751] transition shadow-sm" placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-body">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-body focus:outline-none focus:ring-2 focus:ring-[#008751]/40 focus:border-[#008751] transition shadow-sm" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading focus:outline-none rounded" aria-label={showPassword ? 'Hide' : 'Show'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm" role="alert">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <UserPlus size={18} /> {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="text-center text-sm text-muted pt-1">
            <span>Already have an account? </span>
            <Link to="/login" className="text-[#008751] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#008751] rounded">Log in</Link>
          </div>
        </div>
      </div>

      {/* Right: branded visual */}
      <div className="w-full md:w-[45%] lg:w-[42%] bg-gradient-to-tr from-[#008751] via-[#007b4a] to-[#006a3f] text-white flex flex-col justify-center px-8 md:px-14 lg:px-16 relative overflow-hidden order-2 md:order-2">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-x-8 translate-y-10" />
        <div className="absolute top-16 left-12 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative z-10 space-y-8 max-w-md">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">Join the Platform</h2>
            <p className="text-base md:text-lg text-white/90 font-medium leading-relaxed">Register and unlock access to vocational training, guided progress, and verified skills.</p>
          </div>
          <ul className="space-y-3 text-white/95 text-sm md:text-base leading-relaxed">
            <li className="flex items-start gap-3"><GraduationCap size={18} className="shrink-0 mt-0.5 text-white/80" />Instructor-led progress tracking</li>
            <li className="flex items-start gap-3"><ShieldCheck size={18} className="shrink-0 mt-0.5 text-white/80" />Certified outcomes and skills verification</li>
            <li className="flex items-start gap-3"><Sparkles size={18} className="shrink-0 mt-0.5 text-white/80" />Real-world practice and career growth</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Register;
