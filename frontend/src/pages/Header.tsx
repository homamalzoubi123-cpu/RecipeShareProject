import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "../context/AuthContext";

import Pourder from "../assets/pourder.svg";
import acaunt from "../assets/account.svg";
import home from "../assets/home.svg";
import "./Header.scss";


interface HeaderProps {
   
}

const Header = ({ }: HeaderProps) => {
    // Type Assertion (as AuthContextType) löst die "Property does not exist on type '{}'" Fehler
    const { user, logout } = useContext(AuthContext) as AuthContextType;
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate("/");
    };

    return (
        <header className="header__container">
            <span className="header__container__logo" />
            <h2 className="header__container__title">Recipe Share</h2>
            <div className="header__container__search__container">
                <span className="header__container__search__icon" />
                <input
                    className="header__container__search"
                    type="text"
                    placeholder="Search for recipes..."
                />
            </div>

            {!user ? (
                <Link className="header__container__link__home" to="/">
                    <img className="header__container__home" src={home} alt="home" />
                </Link>
            ) : (
                <Link className="header__container__link__home" to="/Home">
                    <img className="header__container__home" src={home} alt="home" />
                </Link>
            )}

            {user && (
                <Link to="/CreateRecipe" className="add-recipe-btn">
                    {/* Hier kannst du Text oder ein Icon einfügen */}
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
            <img className="header__container__pourder" src={Pourder} alt="pourder" />
        </header>
    );
};

export default Header;