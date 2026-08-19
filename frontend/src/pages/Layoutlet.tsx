import { Outlet } from "react-router-dom";
import Header from "./Header";
interface LayoutProps {
}
const Layout = ({ }: LayoutProps) => {
    return (
        <div>
            <Header />
            <nav></nav>
            <main className="main">
                <Outlet />
            </main>
        </div>
    );
};
export default Layout;