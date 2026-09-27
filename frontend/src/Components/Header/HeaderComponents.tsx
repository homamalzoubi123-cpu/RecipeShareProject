import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import "./HeaderComponents.scss";
import HeaderSearch from "./HeaderSearch"
import HeaderSetting from "./HeaderSetting";

const active = [
    { key: "setting" },
    { key: "account" },
    { key: "add" },
    { key: "Home" }
];

const Header = ({ }) => {

    const { user, logout } = useContext(AuthContext) as AuthContextType;
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const isActive = (key: string) => active.some((item) => item.key === key) && activeKey === key;

    const handleIconClick = (key: string) => {
        setActiveKey((prev) => (prev === key ? null : key));
    };

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <header className="header__container">
          

            <span className="header__container__logo" />

            <div className="header__container__center">
                <div className="header__container__dropdowns" ref={menuRef}>
                    <button
                        className={`header__container__button border-button${isOpen ? " header__container__icon--active" : ""}`}
                        onClick={() => {
                            handleIconClick("account");
                            toggleDropdown();
                        }}
                    >
                        <span className="header__container__account" />
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

                {user && (
                    <Link
                        to="/CreateRecipe"
                        onClick={() => handleIconClick("add")}
                        className={`header__container__btn border-button${isActive("add") ? " header__container__icon--active" : ""}`}
                    >
                        <span className="add-recipe-btn" />
                    </Link>
                )}

                {!user ? (
                    <Link
                        onClick={() => handleIconClick("Home")}
                        className={`header__container__btn border-button${isActive("Home") ? " header__container__icon--active" : ""}`}
                        to="/"
                    >
                        <span className="header__container__home" />
                    </Link>
                ) : (
                    <Link
                        onClick={() => handleIconClick("Home")}
                        className={`header__container__btn border-button${isActive("Home") ? " header__container__icon--active" : ""}`}
                        to="/Home"
                    >
                        <span className="header__container__home" />
                    </Link>
                )}
            </div>

            <HeaderSearch />
             <button
                className={`header__container__pourder-button border-button${isSettingOpen ? " header__container__icon--active" : ""}`}
                onClick={() => {
                    handleIconClick("setting");
                    toggleSetting();
                }}
            >
                <span className="header__container__pourder" />
            </button>
            {isSettingOpen && (
                <div className="header__container__overlay" onClick={toggleSetting} />
            )}
            <HeaderSetting handleLsetting={toggleSetting} isSettingOpen={isSettingOpen} />

        </header>
    );
};

export default Header;