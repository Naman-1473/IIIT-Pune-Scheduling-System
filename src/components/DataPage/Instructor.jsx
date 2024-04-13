import { addInstructorAPI } from "../../utils/constants";
import Cookies from "js-cookie"
const Instructor = () => {
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const instructorId = e.target[0].value;
        const name = e.target[1].value;
        const data = { instructorId, name };
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await fetch(addInstructorAPI, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                const responseData = await response.json();
                console.log(responseData)
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    }
    return (
          <div className="bg-white text-center p-4 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold mb-4">Enter Instructor Data</h1>
              <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                      <input type="text" placeholder="Instructor ID" className="w-full py-2 px-4 border rounded-lg" />
                  </div>
                  <div className="mb-4">
                      <input type="text" placeholder="Instructor Name" className="w-full py-2 px-4 border rounded-lg" />
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-700 transition duration-300">
                      ADD
                  </button>
              </form>
          </div>
    )
}
export default Instructor
