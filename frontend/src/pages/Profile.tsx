import { useEffect, useState, useRef } from "react";
import "./Profile.scss";
import acaunt from "../assets/account.svg";

const API_BASE_URL = "http://localhost:5082";

interface Recipe {
    userId: number;
    userName?: string;
    id: number;
    title: string;
    description: string;
    instructions: string;
    prepTimeMinutes: number;
    difficulty: string;
    imageUrl: string | null;
}

interface UserProfile {
    id?: number;
    imageUrl: string | null;
    username: string;
}

function Profile() {
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>({ imageUrl: null, username: "" });

    // أعداد المتابعين والمتابَعين
    const [followersCount, setFollowersCount] = useState<number>(0);
    const [followingCount, setFollowingCount] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        Promise.all([
            fetch(`${API_BASE_URL}/api/recipes/my-recipes`, { headers }),
            fetch(`${API_BASE_URL}/api/users/me`, { headers })
        ])
            .then(async ([recipesRes, userRes]) => {
                if (!recipesRes.ok) throw new Error("Fehler beim Laden der Rezepte.");
                if (!userRes.ok) throw new Error("Fehler beim Laden des Benutzerprofils.");

                const recipesData: Recipe[] = await recipesRes.json();
                const userData: UserProfile = await userRes.json();

                setMyRecipes(recipesData);
                setUserProfile(userData);

                // جلب قائمة المتابَعين (الأشخاص الذين تتابعهم أنت)
                if (userData.id) {
                    const followingRes = await fetch(`${API_BASE_URL}/api/follow/${userData.id}`);
                    if (followingRes.ok) {
                        const followingData = await followingRes.json();
                        setFollowingCount(followingData.length);
                    }
                }

                setLoading(false);
            })
            .catch((err: unknown) => {
                console.error("Profil-Fehler:", err);
                setError(err instanceof Error ? err.message : "Unbekannter Fehler");
                setLoading(false);
            });
    }, []);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/upload-profile-image`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Fehler beim Hochladen (Status ${res.status})`);
            }

            const data = await res.json();
            setUserProfile((prev) => ({ ...prev, imageUrl: data.imageUrl }));
        } catch (err: unknown) {
            console.error("Upload-Fehler:", err);
            alert(err instanceof Error ? err.message : "Unbekannter Fehler");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Möchtest du dieses Rezept wirklich löschen?")) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Fehler beim Löschen des Rezepts.");

            setMyRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
        } catch (err: unknown) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Unbekannter Fehler");
        }
    };

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return "https://picsum.photos/300/200";
        if (imagePath.startsWith("http")) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    if (loading) return <p>Lade Profil...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="profile-container">
            <div className="profile-header-wrapper">

                <div className="profile-header">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                    />

                    <div className="profile-image-wrapper">
                        {!userProfile?.imageUrl ? (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{ cursor: "pointer" }}
                                title="Klicken zum Ändern des Profilbilds"
                            >
                                <img className="header__container__account" src={acaunt} alt="account" />
                            </button>
                        ) : (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{ cursor: "pointer" }}
                                title="Klicken zum Ändern des Profilbilds"
                            >
                                <img
                                    src={getImageUrl(userProfile.imageUrl)}
                                    alt="Profilbild"
                                    className="profile-image"
                                />
                            </button>
                        )}
                    </div>
                    <div className="profile-info">
                    <div className="username">{userProfile?.username || "Benutzer"}</div>
                    <div className="profile-stats">
                            <div className="profile-stats__item">
                                <span>{myRecipes.length}</span>
                                <strong>Beiträge</strong>
                            </div>
                            <div className="profile-stats__item">
                                <span>289</span>
                                <strong>Follower</strong>
                            </div>
                            <div className="profile-stats__item">
                                <span>{followingCount}</span>
                                <strong>Gefolgt</strong>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-recipes-grid">
                {myRecipes.length === 0 ? (
                    <p>Du hast noch keine Rezepte geteilt.</p>
                ) : (
                    myRecipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            {recipe.imageUrl && (
                                <img
                                    src={getImageUrl(recipe.imageUrl)}
                                    alt={recipe.title}
                                    className="recipe-image"
                                />
                            )}
                            <div className="recipe-content">
                                <h3>{recipe.title}</h3>
                                <p>{recipe.description}</p>
                                <div className="recipe-info">
                                    <span>⏱️ {recipe.prepTimeMinutes} Min</span>
                                    <span>📊 {recipe.difficulty}</span>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(recipe.id)}
                                    >
                                        <span className="Optionen__icon" title="Optionen anzeigen" />
                                    </button>
                                </div>


                          
                              
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Profile;