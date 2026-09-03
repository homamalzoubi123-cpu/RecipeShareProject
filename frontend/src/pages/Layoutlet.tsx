import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = ({ }) => {
    return (
        <div>
            <Header />

            <main className="main">

             <Outlet />
            </main>
        </div>
    );
};
export default Layout;