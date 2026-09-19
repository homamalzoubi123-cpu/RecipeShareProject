import { Outlet, useLocation, matchPath } from "react-router-dom";
import HeaderComponents from "../Components/Header/HeaderComponents";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

const Layout = () => {
    const { user } = useContext(AuthContext) as AuthContextType;
    const location = useLocation();

  
    const profileMatch =
        matchPath("/profile/:userId", location.pathname) ||
        matchPath("/profile/:userId/followers", location.pathname) ||
        matchPath("/profile/:userId/following", location.pathname) ||
        matchPath("/recipe/:userId", location.pathname)
;

    const isViewingOtherProfile =
        profileMatch !== null &&
        profileMatch.params.userId !== undefined &&
        Number(profileMatch.params.userId) !== user?.id;

    const showHeader = user && !isViewingOtherProfile;

    return (
        <div>
            {showHeader && <HeaderComponents />}
            <main className="main">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;