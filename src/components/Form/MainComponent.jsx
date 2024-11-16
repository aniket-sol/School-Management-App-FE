import React, { useState, useEffect } from 'react';
import DynamicForm from './DynamicForm'; 
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { API_URL } from '../../api';

function MainComponent() {
  const [selectedModel, setSelectedModel] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isSuccessOverlayVisible, setIsSuccessOverlayVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isErrorOverlayVisible, setIsErrorOverlayVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);

      if (decodedToken.role === 'admin') {
        setSelectedModel('Class');
      } else if (decodedToken.role === 'teacher') {
        setSelectedModel('Teacher');
      } else if (decodedToken.role === 'student') {
        setSelectedModel('Student');
      }
    } else {
      window.location.href = '/signup';
    }
  }, [token]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSubmit = async (data) => {
    try {
      const userId = jwtDecode(token).userId;
      const commonData = {
        user: userId,
        name: data.name,
      };

      let payload;

      if (selectedModel === 'Student') {
        payload = {
          ...commonData,
          gender: data.gender,
          dob: data.dob,
          contactDetails: data.contactDetails,
          feesPaid: Number(data.feesPaid),
          class: [] // Update as necessary
        };
      } else if (selectedModel === 'Teacher') {
        payload = {
          ...commonData,
          gender: data.gender,
          dob: data.dob,
          contactDetails: data.contactDetails,
          salary: Number(data.salary),
        };
      } else if (selectedModel === 'Class') {
        payload = {
          ...commonData,
          year: data.year,
          studentFees: Number(data.studentFees),
          teacher: data.teacher // Update as necessary
        };
      }
      console.log("Submitting payload:", payload); 

      const response = await fetch(
        `${API_URL}/api/${selectedModel.toLowerCase()}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Network response was not ok');
      }

      const result = await response.json();
      const successMessage = selectedModel === 'Class' 
        ? 'Congrats! A new class has been added!' 
        : `Congrats! You've successfully created your ${selectedModel.toLowerCase()} profile.`;

      setSuccessMessage(successMessage);
      setIsSuccessOverlayVisible(true);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        setIsSuccessOverlayVisible(false);
        navigate('/dashboard'); // Use navigate for redirection
      }, 3000);
      
    } catch (error) {
      console.error(`Error submitting ${selectedModel} data:`, error);
      setErrorMessage(error.message);
      setIsErrorOverlayVisible(true);

      // Hide the error overlay after 3 seconds
      setTimeout(() => {
        setIsErrorOverlayVisible(false);
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex w-4/5 bg-white shadow-md rounded-lg">
        <div className="w-3/5 p-6">
          <h1 className="mb-6 text-2xl font-bold text-center">School Management App Form</h1>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
            disabled={userRole !== 'admin'}
          >
            <option value="Class">Class</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
          {selectedModel && (
            <DynamicForm model={selectedModel} onSubmit={handleSubmit} />
          )}
        </div>
        <div className="w-2/5 p-4">
          <img
            src="/profile.png"
            alt="Profile"
            className="w-full h-full object-cover rounded-r-lg"
          />
        </div>
      </div>

      {/* Success Overlay */}
      {isSuccessOverlayVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="text-white text-2xl">
            {successMessage} Redirecting...
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {isErrorOverlayVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-600 bg-opacity-80 z-50">
          <div className="text-white text-2xl">
            {errorMessage} (disappearing in 3 seconds)
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;
