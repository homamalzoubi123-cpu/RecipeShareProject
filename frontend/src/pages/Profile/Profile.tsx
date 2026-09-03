import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.scss";
import ProfileHeader from "./ProfileHeader";
import RecipeGrid from "./RecipeGrid";

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
    const navigate = useNavigate();

    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>({ imageUrl: null, username: "" });

   
    const [followersCount, setFollowersCount] = useState<number>(0);
    const [followingCount, setFollowingCount] = useState<number>(0);
    const recipesGridRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollToRecipes = () => {
        recipesGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
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
                if (userData.id) {
             
                   const followersRes = await fetch(`${API_BASE_URL}/api/Follow/followers/${userData.id}`, { headers });
                    if (followersRes.ok) {
                        const followersData = await followersRes.json();
                        setFollowersCount(followersData.length);
                    }
                }
               
                if (userData.id) { 
                    const followingRes = await fetch(`${API_BASE_URL}/api/follow/${userData.id}`, { headers });
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

            <ProfileHeader
                userProfile={userProfile}
                recipesCount={myRecipes.length}
                followersCount={followersCount}
                followingCount={followingCount}
                fileInputRef={fileInputRef}
                onImageUpload={handleImageUpload}
                onRecipesClick={scrollToRecipes}
                onFollowersClick={() => {
                    if (userProfile.id) {
                        navigate(`/profile/${userProfile.id}/followers`);
                    }
                }}
                onFollowingClick={() => {
                    if (userProfile.id) {
                        navigate(`/profile/${userProfile.id}/following`);
                    }
                }}
                getImageUrl={getImageUrl}
            />

            <div ref={recipesGridRef}>
                <RecipeGrid
                    recipes={myRecipes}
                    onDelete={handleDelete}
                    getImageUrl={getImageUrl}
                />
            </div>

        </div>
    );
}

export default Profile;
