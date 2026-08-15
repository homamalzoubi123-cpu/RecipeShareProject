import Welcome from "./pages/welcome";
import { Routes, Route } from "react-router-dom";
//import Home from "./pages/Home <Route path="/home" element={<Home />} />
import Login from "./pages/login";
import Register from "./pages/register";
import Layout from "./pages/layoutlet";
import Home from "./pages/Home";
import CreateRecipe from "./pages/CreateRecipe";
function App() {
    return (
       
        <Routes>
            
            <Route path="/" element={<Layout />}>
                <Route index element={<Welcome />} />
                <Route path="/CreateRecipe" element={<CreateRecipe />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Route>
        </Routes>


    );
}

export default App;