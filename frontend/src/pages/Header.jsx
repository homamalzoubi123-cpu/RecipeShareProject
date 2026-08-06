import Pourder from "../assets/pourder.svg";
import acaunt from "../assets/account.svg";
import home from "../assets/home.svg";
import "./Header.scss"
import { useState } from "react";
//import { useContext } from "react";
//import { AuthContext } from "../context/AuthContext";

function Header() {
    //const {tocken ,logout} = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header__container">
            <span className="header__container__logo"  />
            <h2 className="header__container__title">Recipe Share</h2>
            <div className="header__container__search__container">
                <span className="header__container__search__icon" />
                <input
                    className="header__container__search"
                    type="text"
                    placeholder="Search for recipes..."
                   
                />
               
            </div>

            <a className="header__container__link__home" href="/">
                <img className="header__container__home" src={home} alt="home" />
            </a>
            <div className="header__container__dropdowns">
                <button className="header__container__button" onClick={toggleDropdown}>
                    <img className="header__container__account" src={acaunt} alt="account" />
                </button>
                {isOpen && (<div className="header__container__dropdown">
                    <a className="header__container__link" href="/login">Login</a>
                    <a className="header__container__link" href="/register">Register</a>
                    <a className="header__container__link" href="/profile">Profile</a>
                    <a className="header__container__link" href="/logout">Logout</a>
                </div>)}
            </div>
            <img className="header__container__pourder" src={Pourder} alt="pourder" />
        </header>
    );
}

export default Header;