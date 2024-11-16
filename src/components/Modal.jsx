import React from 'react';

const Modal = ({ isOpen, onClose, onSubmit, title, inputLabel, inputValue, onInputChange }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(inputValue); // Send the current value of studentIdToAdd
        onInputChange(''); // Clear the input value in the parent state
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">{inputLabel}</label>
                    <input
                        type="text"
                        value={inputValue} // Use the value from the parent state
                        onChange={(e) => onInputChange(e.target.value)} // Update the parent state
                        className="border p-2 rounded w-full mb-4"
                        required
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
