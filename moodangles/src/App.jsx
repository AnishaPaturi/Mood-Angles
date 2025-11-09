// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard2 from "./pages/Dashboard.jsx";
import UDashboard from "./pages/UDashboard.jsx";
import Landing from "./pages/Landing.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import PLogin from "./pages/PLogin.jsx";
import PSignup from "./pages/PSignup.jsx";
import PDashboard from "./pages/PDashboard.jsx";
import ChatBot from "./pages/ChatBot.jsx";
import Profile from "./pages/Profile.jsx";
import FindTherapist from "./pages/TherapistF.jsx";
import Support from "./pages/Support.jsx";
import Upload from "./pages/UploadD.jsx";
import Articles from "./pages/Articles.jsx";
import Help from "./pages/Help.jsx";
import DepressionTest from "./pages/tests/DepressionTest.jsx";
import AnxietyTest from "./pages/tests/AnxietyTest.jsx";
import ADHDTest from "./pages/tests/ADHDTest.jsx";
import AutismTest from "./pages/tests/AutismTest.jsx";
import BipolarTest from "./pages/tests/BipolarTest.jsx";
import NeuroTest from "./pages/tests/NeuroTest.jsx";
import PersonalityTest from "./pages/tests/PersonalityTest.jsx";
import TestPage from "./pages/TestPage.jsx";
import EQTest from "./pages/tests/EQTest.jsx";
import MentalHealthTodayTest from "./pages/tests/MentalHeathTodayTest.jsx";
import Settings from "./pages/Settings.jsx";
import ResetPassword from "./pages/ResetPassword";

// NavigatorInjector: exposes navigate globally for safe navigation in PDashboard, etc.
function NavigatorInjector({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    window.__navigate = navigate;
    return () => {
      // cleanup when Router unmounts
      // window.__navigate = undefined;
    };
  }, [navigate]);
  return children;
}

function App() {
  return (
    <Router>
      <NavigatorInjector>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Landing />} />
          <Route path="/Dashboard" element={<Dashboard2 />} />
          <Route path="/UDashboard" element={<UDashboard />} />
          <Route path="/profile" element={<Profile />} />
          {/* Psychiatrist routes */}
          <Route path="/plogin" element={<PLogin />} />
          <Route path="/psignup" element={<PSignup />} />
          <Route path="/PDashboard" element={<PDashboard />} />
          <Route path="/ChatBot" element={<ChatBot />} />
          <Route path="/TherapistF" element={<FindTherapist />} />
          <Route path="/support" element={<Support />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/help" element={<Help />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/test/depression" element={<DepressionTest />} />
          <Route path="/test/anxiety" element={<AnxietyTest />} />
          <Route path="/test/adhd" element={<ADHDTest />} />
          <Route path="/test/autism" element={<AutismTest />} />
          <Route path="/test/bipolar" element={<BipolarTest />} />
          <Route path="/test/neuro" element={<NeuroTest />} />
          <Route path="/test/personality" element={<PersonalityTest />} />
          <Route path="/test/eq" element={<EQTest />} />
          <Route path="/test/MentalHealth" element={<MentalHealthTodayTest />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* fallback route */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </NavigatorInjector>
    </Router>
  );
}

export default App;
