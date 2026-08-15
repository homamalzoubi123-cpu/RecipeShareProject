import Pourder from "../assets/pourder.svg";
import acaunt from "../assets/account.svg";
import home from "../assets/home.svg";
import "./Header.scss";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Header() {
    // قم باستدعاء حالة التسجيل من الـ AuthContext (مثلاً: user)
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
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
        
                <Link to="/CreateRecipe" className="add-recipe-btn">
                    ➕ إضافة وصفة
                </Link>
            
            <Link className="header__container__link__home" to="/">
                <img className="header__container__home" src={home} alt="home" />
            </Link>

            <div className="header__container__dropdowns">
                <button className="header__container__button" onClick={toggleDropdown}>
                    <img className="header__container__account" src={acaunt} alt="account" />
                </button>
                {isOpen && (
                    <div className="header__container__dropdown">
                        {/* إذا لم يكن المستخدم مسجلاً لدخوله، اظهر Login و Register */}
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
                            /* إذا كان مسجلاً لدخوله، اظهر Profile و Logout */
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
                                    onClick={() => {
                                        logout();
                                        toggleDropdown();
                                    }}
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
}

export default Header;