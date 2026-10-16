import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/skillup-logo.png';

function VerifyEmail() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-email', { token });
      if (res.data && res.data.success) {
        setSuccess(true);
        setMessage('Email verified. You can now log in.');
      } else {
        setMessage(res.data?.message || 'Verification failed');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#EAF6EF]">
      {/* Left: form */}
      <div className="w-full md:w-[55%] lg:w-[58%] flex items-center justify-center px-6 py-10 md:px-12 lg:px-20 order-2 md:order-1">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e5f7f0] p-8 space-y-6">
          <div className="flex justify-center">
            <img src={logoImg} alt="SkillUp Nigeria logo" className="w-28 h-auto object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-heading text-center">Verify Email</h1>
          <p className="text-body text-center">Enter the verification token from your email.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="Verification token" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-body focus:outline-none focus:ring-2 focus:ring-[#008751]/40 focus:border-[#008751] transition shadow-sm" />
            {message && <div className={`rounded-lg px-4 py-3 text-sm ${success ? 'bg-[#EAF6EF] text-[#008751]' : 'bg-red-50 text-red-700'}`}>{message}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl shadow-md transition-colors disabled:opacity-60 flex items-center justify-center gap-2">{loading ? 'Verifying...' : 'Verify'}</button>
          </form>
          {success && (
            <button onClick={() => navigate('/login')} className="btn-secondary w-full py-2 rounded-xl shadow-sm">Continue to Login</button>
          )}
        </div>
      </div>

      {/* Right: branded visual */}
      <div className="w-full md:w-[45%] lg:w-[42%] bg-gradient-to-br from-[#008751] to-[#007347] text-white flex flex-col justify-center px-8 py-12 md:px-16 lg:px-20 relative overflow-hidden order-1 md:order-2">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-8 max-w-md">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">Activate Your Account</h2>
          <p className="text-lg md:text-xl text-white/90 font-medium">Verify your email to unlock access to courses, lessons, and progress tracking.</p>
          <ul className="space-y-4 text-white/95 text-base md:text-lg leading-relaxed">
            <li className="flex items-start gap-3"><span className="mt-1.5 w-2 h-2 rounded-full bg-white/80 shrink-0" />Secure account activation</li>
            <li className="flex items-start gap-3"><span className="mt-1.5 w-2 h-2 rounded-full bg-white/80 shrink-0" />Full access to vocational courses</li>
            <li className="flex items-start gap-3"><span className="mt-1.5 w-2 h-2 rounded-full bg-white/80 shrink-0" />Instructor and student dashboards</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default VerifyEmail;
