import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard2 from './pages/Dashboard.jsx'
import UDashboard from './pages/UDashboard.jsx'
import Landing from './pages/Landing.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import PLogin from './pages/PLogin.jsx'
import PSignup from './pages/PSignup.jsx'
import Profile from './pages/Profile.jsx'
import Support from './pages/Support.jsx'
import Upload from './pages/UploadD.jsx'
import Help from './pages/Help.jsx'
// import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Landing />} />
        <Route path="/Dashboard" element={<Dashboard2 />} />
        <Route path="/UDashboard" element={<UDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/plogin" element={<PLogin />} />
        <Route path="/psignup" element={<PSignup />} />
        <Route path="/support" element={<Support />} />
        <Route path="/upload" element={<Upload/>}/>
        <Route path="/help" element={<Help/>}/>
      </Routes>
    </Router>
  )
}

export default App
