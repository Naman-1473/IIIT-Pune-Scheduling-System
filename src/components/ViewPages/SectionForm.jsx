import React, { useState } from 'react';

const SectionForm = ({ Section, handleUpdate, handleDelete }) => {
    const [capacity, setCapacity] = useState(Section.capacity);
    return (
        <form className='flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4'>
            <input
                type="text"
                value={Section.sectionId}
                className="w-1/3 py-2 px-4 border rounded-lg mr-2"
                readOnly
            />
            <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-1/3 py-2 px-4 border rounded-lg mr-2"
            />
            <input
                type="text"
                value={Section.departmentName.departmentName}
                className="w-1/3 py-2 px-4 border rounded-lg mr-2"
                readOnly
            />
            <button
                type="button"
                onClick={() => {
                    handleUpdate({
                        sectionId: Section.sectionId,
                        capacity: capacity,
                        departmentName:Section.departmentName.departmentName
                    });
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-blue-600 transition duration-300"
            >
                Update
            </button>
            <button
                type="button"
                onClick={() => {
                    handleDelete(Section.sectionId);
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            >
                Delete
            </button>
        </form>
    );
};

export default SectionForm;
