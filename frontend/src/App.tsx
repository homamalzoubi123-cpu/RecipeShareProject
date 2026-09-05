import Welcome from "./pages/welcome";
import { Routes, Route } from "react-router-dom";
//import Home from "./pages/Home <Route path="/home" element={<Home />} />
import Login from "./pages/login";
import Register from "./pages/register";
import Layout from "./pages/Layoutlet";
import Home from "./pages/Home";
import CreateRecipe from "./pages/CreateRecipe";
import FollowingList from "./Components/Follow/FollowingList";
import FollowersList from "./Components/Follow/FollowersList";
import Profile from "./pages/Profile/Profile";
interface AppProps { }  
function App({ }: AppProps) {
    return (
       
        <Routes>
            
            <Route path="/" element={<Layout />}>
                <Route index element={<Welcome />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:userId/following" element={<FollowingList />} />
                <Route path="/profile/:userId/followers" element={<FollowersList />} />
                <Route path="/CreateRecipe" element={<CreateRecipe />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Route>
        </Routes>


    );
}

export default App;