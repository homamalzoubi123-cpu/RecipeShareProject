import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

const Layout = () => {
  const { user } = useContext(AuthContext) as AuthContextType;

  return (
    <div>
      {user && <Header />}
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;