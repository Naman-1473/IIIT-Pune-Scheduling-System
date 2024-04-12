import { BrowserRouter as Router , Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import AddData from "./pages/AddData";
function App() {
  return (
    <>
      <Router>
         <Routes>
            <Route path="/" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/data" element={<AddData/>}/>
         </Routes>
      </Router>
    </>
  );
}

export default App;
