import { addRoomAPI } from "../../utils/constants";
import Cookies from "js-cookie"
const Room = () => {
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const roomId = e.target[0].value;
        const capacity = e.target[1].value;
        const data = { roomId, capacity };
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await fetch(addRoomAPI, {
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
                <h1 className="text-2xl font-bold mb-4">Enter Room Data</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input type="text" placeholder="Room ID" className="w-full py-2 px-4 border rounded-lg" />
                    </div>
                    <div className="mb-4">
                        <input type="number" placeholder="capacity" className="w-full py-2 px-4 border rounded-lg" />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-700 transition duration-300">
                        ADD
                    </button>
                </form>
            </div>
    )
}
export default Room
