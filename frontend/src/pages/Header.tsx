import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import Pourder from "../assets/pourder.svg";
import acaunt from "../assets/account.svg";
import home from "../assets/home.svg";
import "./Header.scss";
import { API_BASE_URL } from "../config";

interface SearchUser {
    id: number;
    username: string;
    imageUrl?: string;
}
const Header = ({ }) => {
   
    const { user, logout } = useContext(AuthContext) as AuthContextType;
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [allUser, setAllUser] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [isinputactive, setIsinputactive] = useState<boolean>(false);
    const handlealluser = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;

        setAllUser(value);

        if (!value.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/api/users/search?query=${encodeURIComponent(value)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Fehler bei der Suche");
            }

            const data = await response.json();

            setSearchResults(data);
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate("/");
    };
    console.log("Search Results:", isinputactive);

    return (
        <header className="header__container" >
            <span className="header__container__logo" />
            <h2 className="header__container__title">Recipe Share</h2>
            <div className="header__container__search__container">
                <span className="header__container__search__icon" />

                <input
                    className={`header__container__search ${isinputactive ? " header__container__search--active" : ""}`}
                    type="text"
                    placeholder="Search for recipes..."
                    value={allUser}
                    onChange={handlealluser}
                    onClick={() => setIsinputactive(true)}
                />
                {searchResults.length > 0 && (
                    <div className="search-results">
                        {searchResults.map((searchUser) => (
                            <div
                                key={searchUser.id}
                                className="search-result-user"
                                onClick={() => {
                                    navigate(`/profile/${searchUser.id}`);
                                    setAllUser("");
                                    setSearchResults([]);
                                }}
                            >
                                {searchUser.imageUrl ? (
                                    <img
                                        src={`${API_BASE_URL}${searchUser.imageUrl}`}
                                        alt={searchUser.username}
                                        className="search-result-image"
                                    />
                                ) : (
                                    <div className="search-result-placeholder">
                                        👤
                                    </div>
                                )}
                                <span>
                                    {searchUser.username ? searchUser.username : "Keiner gefunden"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>


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

            <div className="header__container__dropdowns"
               >
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