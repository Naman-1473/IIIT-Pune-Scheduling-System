import collegeLogo from "../../assets/images/college_logo.png"
import { Link } from "react-router-dom"
export const Navbar = ()=>{
    const handler = ()=>{

    }
    return(
        <div className="h-1/6 flex justify-between items-center bg-slate-200">
            <div className="m-4">
                <img src={collegeLogo} alt="college logo"
                className="w-20"/>
            </div>
            <div className="flex justify-between items-center mx-4">
                <Link to="../data">
                    <div className="mx-3 cursor-pointer relative">
                            <span className="hover:underline">Add Data</span>
                    </div>
                </Link>
                <div className="mx-3 cursor-pointer relative">
                    <a href="https://www.iiitp.ac.in/" target="_blank">
                        <span className="hover:underline">About the College</span>
                    </a>
                </div>
                <div className="mx-3 cursor-pointer relative">
                        <span className="hover:underline">Schedules</span>
                </div>
                <button className="px-4 py-2 bg-green-400 rounded-md hover:bg-red-500 hover:text-white transition duration-300 ease-in-out" 
                onClick={handler}>
                    Logout
                </button>
            </div>
        </div>
    )
}