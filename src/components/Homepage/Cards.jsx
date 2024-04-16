import { InfoCard } from "./InfoCard"
import facilities from "../../assets/images/facilities.jpeg"
import professors from "../../assets/images/professors.jpeg"
import students from "../../assets/images/students.jpeg"
import courses from "../../assets/images/courses.jpeg"
import time from "../../assets/images/time.jpeg"
import { Link } from "react-router-dom"
const Cards = () => {
  return (
        <div className="flex justify-evenly items-center h-5/6 bg-gray-200">
                <Link to="./Instructor"><InfoCard name="Professors" image={professors}/></Link>
                <Link to="./Section"><InfoCard name="Classes"  image={students}/></Link>
                <Link to="./Room"><InfoCard name="Rooms" image={facilities}/></Link>
                <Link to="./Course"><InfoCard name="Courses"  image={courses}/></Link>
                <Link to="./Timing"><InfoCard name="Time" image={time}/></Link>
        </div>
  )
}
export default Cards;
