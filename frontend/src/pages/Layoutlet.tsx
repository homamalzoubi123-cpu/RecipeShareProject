import { Outlet, useLocation } from "react-router-dom";
import HeaderComponents from "../Components/Header/HeaderComponents";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

const Layout = () => {
  const { user } = useContext(AuthContext) as AuthContextType;

  return (
    <div>
      {user && <HeaderComponents />}
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;