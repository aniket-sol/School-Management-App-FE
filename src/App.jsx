import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage'; // Homepage with login form
import SignupPage from './components/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import AnalyticsDashboard from './components/Dashboard/AnalyticsDashboard';
import MainComponent from './components/Form/MainComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Homepage with login form */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form" element={<MainComponent />} />
        <Route path="/analytics/:classId" element={<AnalyticsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
