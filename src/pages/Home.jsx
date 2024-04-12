import { Navbar } from "../components/Homepage/Navbar"
import { InfoCard } from "../components/Homepage/InfoCard"
import facilities from "../assets/images/facilities.jpeg"
import professors from "../assets/images/professors.jpeg"
import students from "../assets/images/students.jpeg"
const Home = () =>{
    return(
        <div className="h-screen">
            <Navbar/>
            <div className="flex justify-evenly items-center h-5/6">
                <InfoCard name="Professors" image={professors}/>
                <InfoCard name="Classes" image={students}/>
                <InfoCard name="Facilities" image={facilities}/>
            </div>
        </div>
    )
}
export default Home