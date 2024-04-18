const DepartmentForm = ({ Department, handleDelete }) => {
    return (
        <form className='flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4'>
            <input
                type="text"
                value={Department.departmentId}
                className="w-1/6 py-2 px-4 border rounded-lg mr-2"
                readOnly
            />
            <input
                type="text"
                value={Department.departmentName}
                className="w-2/6 py-2 px-4 border rounded-lg mr-2"
                readOnly
            />
            <select className="w-2/6 py-2 px-4 border rounded-lg mr-2">
                    {Department.courses.map((course, index) => (
                        <option key={index}>{course.name}</option>
                    ))}
            </select>
            <button
                type="button"
                onClick={() => {
                    handleDelete(Department.departmentId);
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            >
                Delete
            </button>
        </form>
    );
};

export default DepartmentForm;
