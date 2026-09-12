import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import Pourder from "../../assets/pourder.svg";
import acaunt from "../../assets/account.svg";
import home from "../../assets/home.svg";
import "./HeaderComponents.scss";
import HeaderSearch from "./HeaderSearch";
import HeaderSetting from "./HeaderSetting";

const Header = ({ }) => {

    const { user, token, logout } = useContext(AuthContext) as AuthContextType;
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);

    const toggleSetting = () => {
        setIsSettingOpen(!isSettingOpen);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate("/");
    };

    return (
        <header className="header__container" >
            <span className="header__container__logo" />
            <h2 className="header__container__title">Recipe Share</h2>
            <HeaderSearch />
            {!user ? (
                <Link className="header__container__link__home" to="/">
                    <img className="header__container__home" src={home} alt="Home" />
                </Link>
            ) : (
                <Link className="header__container__link__home" to="/Home">
                    <img className="header__container__home" src={home} alt="Home" />
                </Link>
            )}

            {user && (
                <Link to="/CreateRecipe" className="add-recipe-btn">
                </Link>
            )}

            <div className="header__container__dropdowns">
                <button className="header__container__button" onClick={toggleDropdown}>
                    <img className="header__container__account" src={acaunt} alt="account" />
                </button>

                {isOpen && (
                    <div className="header__container__dropdown">
                        {!user ? (
                            <>
                                <Link
                                    className="header__container__link"
                                    to="/login"
                                    onClick={toggleDropdown}
                                >
                                    Login
                                </Link>
                                <Link
                                    className="header__container__link"
                                    to="/register"
                                    onClick={toggleDropdown}
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    className="header__container__link"
                                    to="/profile"
                                    onClick={toggleDropdown}
                                >
                                    Profile
                                </Link>

                                <button
                                    className="button__header__container__link"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <button className="header__container__pourder-button" onClick={toggleSetting}>
                <img className="header__container__pourder" src={Pourder} alt="pourder" />
            </button>

            {isSettingOpen && (
                <div className="header__container__overlay" onClick={toggleSetting} />
            )}
            <HeaderSetting handleLsetting={toggleSetting} isSettingOpen={isSettingOpen} />

        </header>
    );
};

export default Header;