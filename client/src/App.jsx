import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import logoImg from './assets/skillup-logo.png'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import StudentDashboard from './pages/StudentDashboard'
import CourseCatalogue from './pages/CourseCatalogue'
import CourseDetail from './pages/CourseDetail'
import MyLearning from './pages/MyLearning'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

// Home page shows the welcome content

function WelcomePage() {
  return (
    <div className="container-page">
      <div className="card w-full max-w-2xl space-y-6 text-center relative overflow-hidden">
        {/* Decorative brand accent */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-[#008751]/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#008751]/10 rounded-full blur-3xl -z-10" />
        
        <div className="relative z-10 space-y-6">
          {/* Brand logo */}
          <div className="flex justify-center">
            <img src={logoImg} alt="SkillUp Nigeria logo" className="w-48 md:w-72 lg:w-80 h-auto object-contain drop-shadow-md" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-heading">Student & Instructor Platform</h2>
            <p className="text-body leading-relaxed max-w-lg mx-auto text-base md:text-lg">
              A vocational learning platform empowering students and instructors through accessible, high-quality skills training.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link to="/register" className="btn-primary px-8 py-3 text-base inline-block rounded-xl shadow-md hover:shadow-lg transition-all">Register</Link>
            <Link to="/login" className="btn-secondary px-8 py-3 text-base inline-block rounded-xl shadow-sm hover:shadow transition-all">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/catalogue" element={<CourseCatalogue />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/my-learning" element={<ProtectedRoute allowedRoles={['STUDENT']}><MyLearning /></ProtectedRoute>} />
        <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;