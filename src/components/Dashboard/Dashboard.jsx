import React, { useState, useEffect } from 'react';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        // Check if token exists
        if (!token) {
          console.error('No token found');
          navigate('/signup'); // Redirect to signup if token is not found
          return;
        }

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role; // Get role from decoded token
        console.log(userRole); // Log the user role

        setRole(userRole); // Set the role from the token
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/signup'); // Optionally redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [navigate]);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-cover bg-center p-4" style={{ backgroundImage: "url('/dashboard.jpg')" }}>
      {role === 'student' && <StudentDashboard />}
      {role === 'teacher' && <TeacherDashboard />}
      {role === 'admin' && <AdminDashboard />}
      {!['student', 'teacher', 'admin'].includes(role) && (
        <div className="text-center text-red-500">Unauthorized access</div>
      )}
    </div>
  );
};

export default Dashboard;
