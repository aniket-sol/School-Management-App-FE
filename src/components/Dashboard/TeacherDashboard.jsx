import React, { useEffect, useState } from 'react';
import Table from '../Table';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; 
import { API_URL } from '../../api';

const TeacherDashboard = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }

      const userId = jwtDecode(token).userId; // Get userId from token
      const response = await fetch(`${API_URL}/api/teacher/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Error fetching teacher data:', await response.json());
        setLoading(false);
        return; // Handle error gracefully
      }

      const data = await response.json();
      console.log(data);
      setTeacherData(data);
      setLoading(false);
    };

    fetchTeacherData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Remove the token
    navigate('/'); // Redirect to the login page
  };

  if (loading) return <div>Loading...</div>;

  // Check if assignedClass exists
  const assignedClass = teacherData.assignedClass || {};
  // console.log(assignedClass);
  const studentDetails = assignedClass.students ? assignedClass.students.map(student => ({ name: student.name })) : [];
  // console.log(studentDetails);

  return (
    <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Teacher Dashboard</h1>
      
      {/* Teacher Info Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p><strong>Name:</strong> {teacherData.name}</p>
        <p><strong>DOB:</strong> {new Date(teacherData.dob).toLocaleDateString()}</p>
        <p><strong>Contact Details:</strong> {teacherData.contactDetails}</p>
        <p><strong>Salary:</strong> ${teacherData.salary}</p>
      </div>

      {/* Assigned Class Section */}
      <h2 className="text-2xl font-bold mb-4">Assigned Class: {assignedClass.name || 'N/A'}</h2>
      
      {studentDetails.length > 0 ? (
        <Table headers={['Student Name']} data={studentDetails} onEdit={() => {}} onDelete={() => {}} />
      ) : (
        <div className="text-center text-red-500 mt-4">
          Wait until the admin assigns you a class with students.
        </div>
      )}
      
      <div className="flex justify-center mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/form')}>Edit Profile</button>
        <button className="bg-red-500 text-white px-4 py-2 ml-4 rounded" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
