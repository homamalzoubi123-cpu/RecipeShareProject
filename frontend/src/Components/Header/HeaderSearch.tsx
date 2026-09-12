import React from "react";
import { useState, useContext } from "react";
import { API_BASE_URL } from "../../config";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; 
interface SearchUser {
    id: number;
    username: string;
    imageUrl?: string;
}
interface HeaderSearchProps {

}
const HeaderSearch: React.FC<HeaderSearchProps> = ({

}: HeaderSearchProps) => {
    const { user, token, logout } = useContext(AuthContext) as AuthContextType;
    const [allUser, setAllUser] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [isinputactive, setIsinputactive] = useState<boolean>(false);
    const navigate = useNavigate();

    const handlealluser = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAllUser(value);

        if (!value.trim()) {
            setSearchResults([]);
            return;
        }

        try {
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
	return (
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
	);
}
export default HeaderSearch;