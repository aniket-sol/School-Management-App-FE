import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import FormInput from './Form/FormInput'; // Import the FormInput component
import Navbar from './HomePage/Navbar';
import { API_URL } from '../api';

const SignupPage = () => {
    // export const API_URL = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'student', // Default role
    });
    const [isSuccessOverlayVisible, setIsSuccessOverlayVisible] = useState(false); // State for success overlay
    const [isErrorOverlayVisible, setIsErrorOverlayVisible] = useState(false); // State for error overlay
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [isLoading, setIsLoading] = useState(false); // State for loading button
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true when the form is submitted
        console.log(API_URL);
        const response = await fetch(`${API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        console.log(response);

        const data = await response.json();
        setIsLoading(false); // Reset loading after receiving response
        if (response.ok) {
            // Show the success overlay
            setIsSuccessOverlayVisible(true);
            // Store the token in local storage
            localStorage.setItem('jwtToken', data.token);
            // Redirect based on role
            if (formData.role === 'admin') {
                navigate('/dashboard'); // Admin dashboard
            } else {
                setTimeout(() => {
                    navigate('/form'); // Regular user form
                }, 3000);
            }
        } else {
            // Show the error overlay
            setErrorMessage(data.err || 'An unexpected error occurred.');
            setIsErrorOverlayVisible(true);
            // Hide the error overlay after 3 seconds
            setTimeout(() => {
                setIsErrorOverlayVisible(false);
            }, 3000);
        }
    };

    return (
        <div className="relative flex flex-col h-screen bg-gray-100">
            <Navbar />

            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'url(/signup.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="absolute inset-0 bg-black opacity-60" /> {/* Dark overlay for contrast */}

            {/* Centered Form Content */}
            <div className="relative flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-md">
                    Create Your Account
                </h1>
                <p className="text-xl text-white mb-8 max-w-xl drop-shadow-lg">
                    Join our community to manage your educational experience effectively.
                </p>

                {/* Signup form */}
                <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Signup</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <FormInput
                            label="Username"
                            type="text"
                            required
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Password"
                            type="password"
                            required
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Role</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${isLoading ? 'bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            disabled={isLoading} // Disable button when loading
                        >
                            {isLoading ? 'Signing You Up...' : 'Signup'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{' '}
                        <a href="/" className="text-blue-500 hover:underline">
                            Login
                        </a>
                    </p>
                </div>

                {/* Success Overlay for Signup Success */}
                {isSuccessOverlayVisible && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                        <div className="text-white text-2xl">
                            Signup successful! Redirecting...
                        </div>
                    </div>
                )}

                {/* Error Overlay for Signup Failure */}
                {isErrorOverlayVisible && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-600 bg-opacity-80 z-50">
                        <div className="text-white text-2xl">
                            {errorMessage} (disappearing in 3 seconds)
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignupPage;
