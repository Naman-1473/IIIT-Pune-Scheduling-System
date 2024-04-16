import { BrowserRouter as Router , Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import AddData from "./pages/AddData";
import Cards from "./components/Homepage/Cards";
import Instructor  from "./components/ViewPages/Instructor";
import Room from "./components/ViewPages/Room";
import Course from "./components/ViewPages/Course";
import Section from "./components/ViewPages/Section";
import Timing from "./components/ViewPages/Timing";
function App() {
  return (
    <>
      <Router>
         <Routes>
            <Route path="/" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/home" element={<Home />}>
              <Route path="/home" element={<Cards />} />
              <Route path="/home/Instructor" element={<Instructor />} />
              <Route path="/home/Room" element={<Room />} />
              <Route path="/home/Course" element={<Course />} />
              <Route path="/home/Section" element={<Section />} />
              <Route path="/home/Timing" element={<Timing />} />
            </Route>
            <Route path="/data" element={<AddData/>}/>
         </Routes>
      </Router>
    </>
  );
}

export default App;
