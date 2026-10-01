import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

    const { user } = useContext(AuthContext) as AuthContextType;
    const navigate = useNavigate();
    const location = useLocation();
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

    useEffect(() => {
        // Aktivzustand aus der Route ableiten, damit er auch ohne Klick stimmt:
        // Direktaufruf, Zurück-Button, oder Login (dann landet man auf "/").
        const path = location.pathname;
        if (path === "/" || path === "/Home") {
            setActiveKey("Home");
        } else if (path === "/CreateRecipe") {
            setActiveKey("add");
        } else if (path.startsWith("/profile")) {
            setActiveKey("account");
        } else {
            setActiveKey(null);
        }
    }, [location.pathname]);

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
                {!user ? (
                    <div className="header__container__dropdowns" ref={menuRef}>
                        <button
                            className={`header__container__button border-button${isOpen ? " header__container__icon--active" : ""}`}
                            onClick={toggleDropdown}
                        >
                            <span className="header__container__account" />
                        </button>

                        {isOpen && (
                            <div className="header__container__dropdown">
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
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to="/profile"
                        onClick={() => handleIconClick("account")}
                        className={`header__container__btn border-button${isActive("account") ? " header__container__icon--active" : ""}`}
                    >
                        <span className="header__container__account" />
                    </Link>
                )}

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
                <div className="set__overlay" onClick={toggleSetting} />
            )}
            <HeaderSetting handleLsetting={toggleSetting} isSettingOpen={isSettingOpen} />

        </header>
    );
};

export default Header;