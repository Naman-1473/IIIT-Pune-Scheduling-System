import React from 'react';

const TimingForm = ({ Timing, handleDelete }) => {
    return (
        <form key={Timing._id} className='flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4'>
            <input
                type="text"
                value={Timing.startTime}
                className="w-1/2 py-2 px-4 border rounded-lg mr-2"
                readOnly
            />
            <input
                type="text"
                value={Timing.endTime}
                className="w-1/2 py-2 px-4 border rounded-lg mr-2"
                readOnly
            />
            <button
                type="button"
                onClick={() => {
                    handleDelete(Timing.startTime);
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            >
                Delete
            </button>
        </form>
    );
};

export default TimingForm;
