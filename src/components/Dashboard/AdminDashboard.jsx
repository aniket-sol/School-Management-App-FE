import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';

const AdminDashboard = () => {
    const [adminData, setAdminData] = useState({ classes: [] });
    const [totalTeacherSalary, setTotalTeacherSalary] = useState(0);
    const [totalFeesReceived, setTotalFeesReceived] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('jwtToken');
        
            // Fetch classes data
            const classResponse = await fetch(`${API_URL}/api/class`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        
            if (!classResponse.ok) {
                console.error('Failed to fetch classes data');
                setLoading(false);
                return;
            }
        
            const classesData = await classResponse.json();
            setAdminData({ classes: classesData });
            
            const teacherResponse = await fetch(`${API_URL}/api/teacher/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        
            if (!teacherResponse.ok) {
                console.error('Failed to fetch teachers data');
                setLoading(false);
                return;
            }
            
            const teachersData = await teacherResponse.json();
            console.log('Teachers Data:', teachersData); // Debugging log
        
            // Calculate total salaries
            const totalSalary = teachersData.reduce((sum, teacher) => sum + (teacher.salary || 0), 0);
            setTotalTeacherSalary(totalSalary);
            console.log('Total Teacher Salary:', totalSalary); // Debugging log
        
            // Fetch students data to calculate total fees received
            const studentResponse = await fetch(`${API_URL}/api/student/`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        
            if (!studentResponse.ok) {
                console.error('Failed to fetch students data');
                setLoading(false);
                return;
            }
        
            const studentsData = await studentResponse.json();
            console.log('Students Data:', studentsData); // Debugging log
            const totalFees = studentsData.reduce((sum, student) => sum + (student.feesPaid || 0), 0);
            setTotalFeesReceived(totalFees);
            console.log('Total Fees Received:', totalFees); // Debugging log
        
            setLoading(false);
        };

        fetchAdminData();
    }, []);

    const handleLogout = () => {
        // Remove token from local storage
        localStorage.removeItem('jwtToken');
        // Redirect to login page
        navigate('/');
    };

    const handleDelete = async (classId) => {
        const token = localStorage.getItem('jwtToken');

            // Fetch classes data
            const response = await fetch(`${API_URL}/api/class/${classId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        if (response.ok) {
            // Refresh the class data after deletion
            setAdminData(prevData => ({
                classes: prevData.classes.filter(classItem => classItem._id !== classId),
            }));
            alert('Class deleted successfully');
        } else {
            console.error('Failed to delete class');
        }
    };

    if (loading) return <div className="text-center text-lg">Loading...</div>;

    return (
        <div className="bg-gradient-to-r from-blue-200 to-purple-300 p-8 rounded-lg shadow-lg w-full max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Admin Dashboard</h1>

            {/* Create Class Button */}
            <div className="flex justify-end mb-4">
                <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                    onClick={() => navigate('/form')}
                >
                    Create a Class
                </button>
            </div>

            {/* Classes Table */}
            <h2 className="text-3xl font-semibold mb-4 text-gray-700">Classes Overview</h2>
            <div className="overflow-x-auto rounded-lg shadow-lg">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 border-b text-left text-gray-600">Class Name</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600">Year</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600">Teacher</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600">No. of Students</th>
                            <th className="py-3 px-4 border-b text-left text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminData.classes.length > 0 ? (
                            adminData.classes.map((classItem) => (
                                <tr
                                    key={classItem._id}
                                    className="hover:bg-gray-100 cursor-pointer"
                                    onClick={() => navigate(`/analytics/${classItem._id}`)} // Navigate to analytics with class ID
                                >
                                    <td className="py-2 px-4 border-b">{classItem.name}</td>
                                    <td className="py-2 px-4 border-b">{classItem.year}</td>
                                    <td className="py-2 px-4 border-b">{classItem.teacher ? classItem.teacher.name : 'N/A'}</td>
                                    <td className="py-2 px-4 border-b">{classItem.students ? classItem.students.length : 0}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent row click event
                                                handleDelete(classItem._id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-2 px-4 border-b text-center">No classes available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Financial Overview */}
            <h2 className="text-3xl font-semibold mb-4 text-gray-700">Financial Overview</h2>
            <div className="flex justify-between bg-white rounded-lg p-4 shadow-lg mb-6">
                <div className="text-lg font-bold">Total Teacher Salary: <span className="text-blue-600">{totalTeacherSalary || 0}</span></div>
                <div className="text-lg font-bold">Total Fees Received: <span className="text-green-600">{totalFeesReceived || 0}</span></div>
            </div>

            {/* Logout Button */}
            <div className="flex justify-center mt-6">
                <button
                    className="bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition duration-300"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
