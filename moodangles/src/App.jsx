import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard2 from './pages/Dashboard-2.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import PLogin from './pages/PLogin.jsx'
import PSignup from './pages/PSignup.jsx'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/plogin" element={<PLogin />} />
        <Route path="/psignup" element={<PSignup />} />
      </Routes>
    </Router>
  )
}

export default App
