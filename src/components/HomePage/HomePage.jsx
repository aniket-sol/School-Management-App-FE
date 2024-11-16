import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import FormInput from '../Form/FormInput';
import Navbar from './Navbar';
import { API_URL } from '../../api';

const HomePage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isSuccessOverlayVisible, setIsSuccessOverlayVisible] = useState(false); // State for overlay
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // Show the success overlay
      setIsSuccessOverlayVisible(true);
      // Store token if present
      localStorage.setItem('jwtToken', data.token);
      
      // Redirect to /dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000); // Redirect after 3 seconds
    } else {
      alert('Login failed: ' + data.err); // Handle errors
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-gray-100">
      <Navbar /> {/* Include the Navbar component */}

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/school.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black opacity-40" /> {/* Darker overlay for contrast */}

      {/* Centered content */}
      <div className="relative flex flex-col items-center justify-center h-full px-4">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center drop-shadow-md">
          Welcome to the School Management App
        </h1>
        <p className="text-xl text-white mb-8 text-center max-w-2xl drop-shadow-md">
          Manage your classes, teachers, and students with ease.
        </p>

        {/* Login form container */}
        <div className="absolute right-0 top-1/3 p-8 w-full max-w-sm">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full transform transition duration-300 hover:scale-105">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <FormInput 
                label="Username" 
                type="text" 
                name="username" 
                required 
                value={formData.username} 
                onChange={handleChange} 
              />
              <FormInput 
                label="Password" 
                type="password" 
                name="password" 
                required 
                value={formData.password} 
                onChange={handleChange} 
              />
              <button 
                type="submit" 
                className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              >
                Login
              </button>
            </form>
            <p className="mt-6 text-center text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-500 hover:underline">
                Signup
              </a>
            </p>
          </div>
        </div>

        {/* Success Overlay for Login Success */}
        {isSuccessOverlayVisible && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="text-white text-2xl">
              Login successful! Redirecting to dashboard...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
