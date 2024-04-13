import collegeLogo from "../../assets/images/college_logo.png"
import { Link } from "react-router-dom"
import { logoutAPI } from "../../utils/constants"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
export const Navbar = ()=>{
    const navigate = useNavigate()
    const handler = async ()=>{
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await fetch(logoutAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${accessToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                Cookies.remove('refreshToken')
                Cookies.remove('accessToken')
                navigate('../login')
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    }
    return(
        // <div className="h-1/6 flex justify-between items-center bg-slate-200">
        //     <div className="m-4">
        //         <img src={collegeLogo} alt="college logo"
        //         className="w-20"/>
        //     </div>
        //     <div className="flex justify-between items-center mx-4">
        //         <Link to="../data">
        //             <div className="mx-3 cursor-pointer relative">
        //                     <span className="hover:underline">Add Data</span>
        //             </div>
        //         </Link>
        //         <div className="mx-3 cursor-pointer relative">
        //             <a href="https://www.iiitp.ac.in/" target="_blank">
        //                 <span className="hover:underline">About the College</span>
        //             </a>
        //         </div>
        //         <div className="mx-3 cursor-pointer relative">
        //                 <span className="hover:underline">Schedules</span>
        //         </div>
        //         <button className="px-4 py-2 bg-green-400 rounded-md hover:bg-red-500 hover:text-white transition duration-300 ease-in-out" 
        //         onClick={handler}>
        //             Logout
        //         </button>
        //     </div>
        // </div>
        <div className="h-1/6 flex justify-between items-center bg-gradient-to-r from-blue-700 to-blue-900 px-4">
            <div className="flex items-center">
                <img src={collegeLogo} alt="college logo" className="w-14 rounded-xl" />
                <h1 className="text-white text-lg ml-2 font-bold">IIIT Pune</h1>
            </div>
            <div className="flex items-center space-x-8">
                <Link to="../data">
                    <div className="cursor-pointer text-white hover:underline transition duration-300">
                        Add Data
                    </div>
                </Link>
                <a href="https://www.iiitp.ac.in/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline transition duration-300">
                    About the College
                </a>
                <div className="text-white hover:underline transition duration-300">
                    Schedules
                </div>
                <button className="px-4 py-2 bg-green-400 rounded-md hover:bg-red-500 hover:text-white transition duration-300 ease-in-out focus:outline-none" onClick={handler}>
                    Logout
                </button>
            </div>
        </div>
    )
}