import React, { useState } from 'react';
import FormInput from './FormInput'; // Adjust the import path as necessary

const formModels = {
  Class: [
    { label: 'Class Name', key: 'name', type: 'text', required: true },
    { label: 'Year', key: 'year', type: 'text', required: true },
    { label: 'Teacher ID', key: 'teacher', type: 'text' },
    { label: 'Student Fees', key: 'studentFees', type: 'number', required: true },
    // { label: 'Max Students', key: 'maxStudents', type: 'number' },
  ],
  Teacher: [
    { label: 'Name', key: 'name', type: 'text', required: true },
    { label: 'Gender', key: 'gender', type: 'select', required: true, options: ['Male', 'Female'] },
    { label: 'Date of Birth', key: 'dob', type: 'date', required: true },
    { label: 'Contact Details', key: 'contactDetails', type: 'text', required: true },
    { label: 'Salary', key: 'salary', type: 'number', required: true },
  ],
  Student: [
    { label: 'Name', key: 'name', type: 'text', required: true },
    { label: 'Gender', key: 'gender', type: 'select', required: true, options: ['Male', 'Female'] },
    { label: 'Date of Birth', key: 'dob', type: 'date', required: true },
    { label: 'Contact Details', key: 'contactDetails', type: 'text', required: true },
    { label: 'Fees Paid', key: 'feesPaid', type: 'number', required: true },
  ],
};

function DynamicForm({ model, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({}); // Reset the form data to an empty state
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-6">{model} Details</h2>
      <div className="grid grid-cols-2 gap-4">
        {formModels[model]?.map((field) => (
          <FormInput
            key={field.key}
            label={field.label}
            type={field.type}
            value={formData[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            required={field.required}
            options={field.options} // Pass the options for the select input
          />
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
        <button type="button" onClick={handleReset} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
          Reset
        </button>
      </div>
    </form>
  );
}

export default DynamicForm;
