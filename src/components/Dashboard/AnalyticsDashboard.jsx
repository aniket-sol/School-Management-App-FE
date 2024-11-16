import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Bar } from 'react-chartjs-2';
import Modal from '../Modal'; // Import the modal component
import Table from '../Table'; // Import the Table component
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { API_URL } from '../../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
    const { classId } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const [classData, setClassData] = useState(null);
    const [studentsData, setStudentsData] = useState([]);
    const [teacherData, setTeacherData] = useState(null); // State for teacher data
    const [loading, setLoading] = useState(true);
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    // State for modals and student input
    const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);
    const [isAssignTeacherModalOpen, setAssignTeacherModalOpen] = useState(false);
    const [studentIdToAdd, setStudentIdToAdd] = useState(''); // State for the student ID input
    const [teacherIdToAdd, setTeacherIdToAdd] = useState(''); // State for the student ID input

    useEffect(() => {
        const fetchClassData = async () => {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`${API_URL}/api/class/${classId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
                console.error('Failed to fetch class data');
                setLoading(false);
                return;
            }

            const data = await response.json();
            setClassData(data);

            // Fetch teacher details
            if (data.teacher) {
                const teacherResponse = await fetch(
                  `${API_URL}/api/teacher/teacher/${data.teacher}`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (teacherResponse.ok) {
                    const teacher = await teacherResponse.json();
                    setTeacherData(teacher); // Store teacher data
                }
            }

            // Fetch student details
            const studentResponses = await Promise.all(
              data.students.map((studentId) =>
                fetch(`${API_URL}/api/student/student/${studentId}`, {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
              )
            );
            const students = await Promise.all(studentResponses.map(res => res.json()));
            setStudentsData(students);

            // Count male and female students
            const maleStudents = students.filter(student => student.gender && student.gender.toLowerCase() === 'male').length;
            const femaleStudents = students.filter(student => student.gender && student.gender.toLowerCase() === 'female').length;
            setMaleCount(maleStudents);
            setFemaleCount(femaleStudents);

            // Calculate total revenue
            const revenue = students.reduce((total, student) => total + (student.feesPaid || 0), 0);
            setTotalRevenue(revenue);

            setLoading(false);
        };

        fetchClassData();
    }, [classId]);

    const handleAddStudent = async () => {
        console.log('Student ID to add:', studentIdToAdd); // Check if this is valid
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(
          `${API_URL}/api/class/${classId}/assign-student`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ studentId: studentIdToAdd }),
          }
        );
    
        if (response.ok) {
            window.location.reload();
        } else {
            console.error('Failed to add student');
        }
    };

    const handleAssignTeacher = async (teacherId) => {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(
          `${API_URL}/api/teacher/${teacherId}/assign-class`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ class: classData.name }),
          }
        );

        if (response.ok) {
            window.location.reload();
        } else {
            console.error('Failed to assign teacher');
        }
    };

    if (loading) return <div className="text-center text-lg">Loading...</div>;

    const data = {
        labels: ['Male', 'Female'],
        datasets: [
            {
                label: 'Number of Students',
                data: [maleCount, femaleCount],
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const headers = ['Name', 'Date of Birth', 'Gender'];

    const tableData = studentsData.map(student => ({
        name: student.name,
        dob: student.dob,
        gender: student.gender,
    }));

    return (
        <div className="bg-gradient-to-r from-purple-200 to-blue-300 p-8 rounded-lg shadow-lg w-full max-w-6xl mx-auto relative">
            <button
                className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                onClick={() => navigate('/dashboard')} // Navigate to dashboard
            >
                Go Back
            </button>

            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">{classData.name} - Analytics</h1>
            <div className="mb-6">
                <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Class Details</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <p><strong>Year:</strong> {classData.year}</p>
                <p><strong>Teacher:</strong> {teacherData ? teacherData.name : 'N/A'}</p> {/* Display teacher's name */}
                <p><strong>Total Students:</strong> {studentsData.length}</p>
                <p><strong>Total Revenue:</strong> {totalRevenue} INR</p>
                <h3 className="text-lg font-semibold mt-4">Students List:</h3>
                <Table headers={headers} data={tableData} />
            </div>
            <div className="flex justify-center mt-4">
                <button
                    className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300 mx-2"
                    onClick={() => setAddStudentModalOpen(true)}
                >
                    Add Student
                </button>
                <button
                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-700 transition duration-300 mx-2"
                    onClick={() => setAssignTeacherModalOpen(true)}
                >
                    Assign Teacher
                </button>
            </div>

            {/* Add Student Modal */}
            <Modal
                isOpen={isAddStudentModalOpen}
                onClose={() => setAddStudentModalOpen(false)}
                onSubmit={handleAddStudent}
                title="Add Student to Class"
                inputLabel="Enter Student ID:"
                onInputChange={setStudentIdToAdd}
                inputValue={studentIdToAdd}
                />

            {/* Assign Teacher Modal */}
            <Modal
                isOpen={isAssignTeacherModalOpen}
                onClose={() => setAssignTeacherModalOpen(false)}
                onSubmit={handleAssignTeacher}
                title="Assign Teacher to Class"
                inputLabel="Enter Teacher ID:"
                onInputChange={setTeacherIdToAdd}
                inputValue={teacherIdToAdd}
                />
        </div>
    );
};

export default AnalyticsDashboard;
