import React, { useEffect, useState } from 'react';
import Table from '../Table';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api'; 

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }

      const userId = jwtDecode(token).userId;
      const response = await fetch(`${API_URL}/api/student/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Error fetching student data:', await response.json());
        setLoading(false);
        return; // Handle error gracefully
      }

      const data = await response.json();
      console.log(data);
      setStudentData(data);
      setLoading(false);
    };

    fetchStudentData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Remove the token
    navigate('/'); // Redirect to the login page
  };

  if (loading) return <div>Loading...</div>;

  // Define headers for the table
  const studentHeaders = ['Name', 'Contact Details', 'DOB', 'Fees Paid', 'Class', 'Teacher'];
  const studentDetails = [
    {
      name: studentData.name,
      contactDetails: studentData.contactDetails,
      dob: new Date(studentData.dob).toLocaleDateString(), // Format DOB
      feesPaid: studentData.feesPaid,
      className: studentData.class.length > 0 ? studentData.class[0].name : 'N/A', // Placeholder for class name
      teacherName: studentData.class.length > 0 ? studentData.class[0].teacherName : 'N/A', // Placeholder for teacher name
    },
  ];

  return (
    <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Student Dashboard</h1>
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <Table headers={studentHeaders} data={studentDetails} onEdit={() => {}} onDelete={() => {}} />
      <div className="flex justify-center mt-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/form')} >Edit Profile</button>
        <button className="bg-red-500 text-white px-4 py-2 ml-4 rounded" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default StudentDashboard;
