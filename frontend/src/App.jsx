import Welcome from "./pages/welcome";
import { Routes, Route } from "react-router-dom";
//import Home from "./pages/Home <Route path="/home" element={<Home />} />
import Login from "./pages/login";
import Register from "./pages/register";
function App() {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>

    );
}

export default App;