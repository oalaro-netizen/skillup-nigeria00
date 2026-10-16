import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import axios from 'axios';
import logoImg from '../assets/skillup-logo.png';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState(''); // Added role selection state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role: selectedRole, // Send selected role to backend
      });

      if (res.data && res.data.success) {
        setSuccessMessage('Login successful');
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        navigate(res.data.user?.role === 'STUDENT' ? '/student-dashboard' : '/dashboard');
      } else {
        setError(res.data?.message || 'Login failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#EAF6EF]">
      {/* Left: form */}
      <div className="w-full md:w-[55%] lg:w-[58%] flex items-center justify-center px-6 md:px-14 lg:px-20 py-12 md:py-16">
        <div className="w-full max-w-md space-y-7 bg-white rounded-3xl shadow-xl border border-[#e5f7f0]/60 p-8 md:p-10">
          <div className="flex justify-center mb-2">
            <img src={logoImg} alt="SkillUp Nigeria logo" className="w-16 h-16 object-contain drop-shadow-sm" />
          </div>
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-heading leading-tight tracking-tight">
              Log in
            </h1>
            <p className="text-base text-muted font-medium">
              Welcome back to SkillUp Nigeria
            </p>
          </div>

          {/* Role selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-body">Select your role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('STUDENT')}
                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedRole === 'STUDENT'
                    ? 'border-[#008751] bg-[#EAF6EF]'
                    : 'border-gray-200 hover:border-[#008751]/50 hover:bg-[#EAF6EF]/30'
                }`}
                aria-pressed={selectedRole === 'STUDENT'}
              >
                <span className="text-3xl">🎓</span>
                <span className="font-semibold text-body text-center">Student</span>
                <span className="text-xs text-muted text-center">Learn and track progress</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('INSTRUCTOR')}
                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedRole === 'INSTRUCTOR'
                    ? 'border-[#008751] bg-[#EAF6EF]'
                    : 'border-gray-200 hover:border-[#008751]/50 hover:bg-[#EAF6EF]/30'
                }`}
                aria-pressed={selectedRole === 'INSTRUCTOR'}
              >
                <span className="text-3xl">👩‍🏫</span>
                <span className="font-semibold text-body text-center">Tutor</span>
                <span className="text-xs text-muted text-center">Teach and guide learners</span>
              </button>
            </div>
            {selectedRole && <p className="text-xs text-[#008751]">Selected: {selectedRole === 'STUDENT' ? 'Student' : 'Tutor'}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-body">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-body focus:outline-none focus:ring-2 focus:ring-[#008751]/40 focus:border-[#008751] transition shadow-sm"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-body">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-white text-body focus:outline-none focus:ring-2 focus:ring-[#008751]/40 focus:border-[#008751] transition shadow-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading focus:outline-none focus:ring-2 focus:ring-[#008751] rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm" role="alert">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="rounded-lg bg-[#EAF6EF] border border-[#008751]/20 px-4 py-3 text-[#008751] text-sm" role="status">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="text-center text-sm text-muted space-y-1 pt-2">
            <span>Don’t have an account? </span>
            <Link to="/register" className="text-[#008751] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#008751] rounded">
              Register
            </Link>
            <p className="text-xs text-muted/60">Forgot Password? Coming soon.</p>
          </div>
        </div>
      </div>

      {/* Right: branded visual panel */}
      <div className="w-full md:w-[45%] lg:w-[42%] bg-gradient-to-tr from-[#008751] via-[#007b4a] to-[#006a3f] text-white flex flex-col justify-center px-8 md:px-14 lg:px-16 relative overflow-hidden order-2 md:order-2">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 space-y-8 max-w-md">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white">Learn Practical Skills</h2>
            <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed">
              Build a career through accessible, high-quality vocational training guided by experienced instructors.
            </p>
          </div>
          <ul className="space-y-3 text-white/95 text-sm md:text-base leading-relaxed">
            <li className="flex items-start gap-3"><GraduationCap size={18} className="shrink-0 mt-0.5 text-white/80" />Instructor-led progress and feedback</li>
            <li className="flex items-start gap-3"><ShieldCheck size={18} className="shrink-0 mt-0.5 text-white/80" />Verified skills and certificates</li>
            <li className="flex items-start gap-3"><Sparkles size={18} className="shrink-0 mt-0.5 text-white/80" />Real-world practice and career growth</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;