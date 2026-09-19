import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.scss";
import ProfileHeader from "./ProfileHeader";
import RecipeGrid from "./RecipeGrid";
import { API_BASE_URL } from "../../config";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import InputField from "../../Components/InputField/InputField";

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

const Profile = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const isOwnProfile = !userId; // Keine ID in der URL = eigenes Profil
    const { token } = useContext(AuthContext) as AuthContextType;

    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [followersCount, setFollowersCount] = useState<number>(0);
    const [followingCount, setFollowingCount] = useState<number>(0);
    const recipesGridRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null); // Ref für Bild-Upload im Bearbeiten-Modal
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [userProfile, setUserProfile] = useState<UserProfile>({
        imageUrl: null,
        username: ""
    });

    const scrollToRecipes = () => {
        recipesGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleDelete = (id: number) => {
        setConfirmDeleteId(id);
    };

    const handleEditClick = (recipe: Recipe) => {
        setEditingRecipe(recipe);
        setEditImageFile(null); // Bild-State beim Öffnen zurücksetzen
    };

    useEffect(() => {
        setLoading(true);
        const storedToken = localStorage.getItem("token") || token;
        const headers = {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json"
        };

        const userEndpoint = isOwnProfile
            ? `${API_BASE_URL}/api/users/me`
            : `${API_BASE_URL}/api/users/${userId}`;

        const recipesEndpoint = isOwnProfile
            ? `${API_BASE_URL}/api/recipes/my-recipes`
            : `${API_BASE_URL}/api/recipes/user/${userId}`;

        Promise.all([
            fetch(recipesEndpoint, { headers }),
            fetch(userEndpoint, { headers })
        ])
            .then(async ([recipesRes, userRes]) => {
                if (!recipesRes.ok) throw new Error("Fehler beim Laden der Rezepte.");
                if (!userRes.ok) throw new Error("Fehler beim Laden des Benutzerprofils.");

                const recipesData: Recipe[] = await recipesRes.json();
                const userData: UserProfile = await userRes.json();

                setMyRecipes(recipesData);
                setUserProfile(userData);

                if (userData.id) {
                    const followersRes = await fetch(
                        `${API_BASE_URL}/api/Follow/followers/${userData.id}`,
                        { headers }
                    );
                    if (followersRes.ok) {
                        const followersData = await followersRes.json();
                        setFollowersCount(followersData.length);
                    }
                }

                if (userData.id) {
                    const followingRes = await fetch(
                        `${API_BASE_URL}/api/follow/${userData.id}`,
                        { headers }
                    );
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
    }, [userId, isOwnProfile, token]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const storedToken = localStorage.getItem("token") || token;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/upload-profile-image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${storedToken}`
                },
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(
                    errorData.error || `Fehler beim Hochladen (Status ${res.status})`
                );
            }

            const data = await res.json();
            setUserProfile((prev) => ({ ...prev, imageUrl: data.imageUrl }));
        } catch (err: unknown) {
            console.error("Upload-Fehler:", err);
            alert(err instanceof Error ? err.message : "Unbekannter Fehler");
        }
    };

    // Bearbeitung des Rezepts per FormData (inklusive Bild-Upload)
    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingRecipe) return;

        const storedToken = localStorage.getItem("token") || token;

        const formData = new FormData();
        formData.append("Title", editingRecipe.title);
        formData.append("Description", editingRecipe.description || "");
        formData.append("Instructions", editingRecipe.instructions || "");
        formData.append("PrepTimeMinutes", editingRecipe.prepTimeMinutes.toString());
        formData.append("Difficulty", editingRecipe.difficulty);

        if (editImageFile) {
            formData.append("ImageFile", editImageFile);
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/recipes/${editingRecipe.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${storedToken}`
                },
                body: formData
            });

            if (!res.ok) throw new Error("Fehler beim Aktualisieren des Rezepts.");

            const updatedRecipe = await res.json();

            // Rezept-Liste lokal aktualisieren
            setMyRecipes((prev) =>
                prev.map((r) => (r.id === editingRecipe.id ? updatedRecipe : r))
            );

            setEditingRecipe(null);
            setEditImageFile(null);
        } catch (err) {
            console.error(err);
            alert("Fehler beim Aktualisieren des Rezepts.");
        }
    };

    const confirmDelete = async () => {
        if (confirmDeleteId === null) return;

        const storedToken = localStorage.getItem("token") || token;

        try {
            const res = await fetch(`${API_BASE_URL}/api/recipes/${confirmDeleteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            });

            if (!res.ok) throw new Error("Fehler beim Löschen des Rezepts.");

            setMyRecipes((prev) =>
                prev.filter((recipe) => recipe.id !== confirmDeleteId)
            );
        } catch (err: unknown) {
            console.error(err);
            setErrorMessage(err instanceof Error ? err.message : "Unbekannter Fehler");
        } finally {
            setConfirmDeleteId(null);
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
        <div
            className={`profile-container ${!isOwnProfile ? "profile-container__own-profile" : ""}`}
        >
            {!isOwnProfile && (
                <button className="back-button_profile" onClick={() => navigate(-1)}>
                    zum mein Profil
                </button>
            )}
            <ProfileHeader
                userProfile={userProfile}
                recipesCount={myRecipes.length}
                followersCount={followersCount}
                followingCount={followingCount}
                fileInputRef={fileInputRef}
                onImageUpload={isOwnProfile ? handleImageUpload : undefined}
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
                {/* Modal für Lösch-Bestätigung */}
                {confirmDeleteId !== null && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <button
                                className="close-button"
                                onClick={() => setConfirmDeleteId(null)}
                            >
                                ×
                            </button>
                            <p>Möchtest du dieses Rezept wirklich löschen?</p>
                            <div className="modal-actions">
                                <button onClick={() => setConfirmDeleteId(null)}>Abbrechen</button>
                                <button onClick={confirmDelete}>Löschen</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal für Rezept bearbeiten */}
                {editingRecipe && (
                    <div className="modal-overlay">
                        <div className="ubdate__Rezept">
                            <button
                                type="button"
                                className="close-button"
                                onClick={() => {
                                    setEditingRecipe(null);
                                    setEditImageFile(null);
                                }}
                            >
                                ×
                            </button>
                            <h3>Rezept bearbeiten</h3>

                            <form onSubmit={handleUpdateSubmit}>
                                {/* Verstecktes File-Input für den Klick auf das Bild */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={editFileInputRef}
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setEditImageFile(e.target.files[0]);
                                        }
                                    }}
                                />

                                {/* Klickbarer Bild-Container mit Overlay */}
                                <div
                                    className="edit__recipe__image__container"
                                    onClick={() => editFileInputRef.current?.click()}
                                    title="Klicke hier, um das Bild zu ändern"
                                >
                                    <img
                                        src={
                                            editImageFile
                                                ? URL.createObjectURL(editImageFile)
                                                : getImageUrl(editingRecipe.imageUrl)
                                        }
                                        alt="Rezeptbild"
                                    />
                                    <div className="image-overlay">
                                        <span>Bild ändern</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <InputField
                                    type="text"
                                    name="title"
                                    value={editingRecipe.title}
                                    placeholder="title"
                                    onChange={(e) =>
                                        setEditingRecipe({ ...editingRecipe, title: e.target.value })
                                    }
                                    required
                                    label=""
                                />

                                {/* Description */}
                                <InputField
                                    type="text"
                                    name="description"
                                    value={editingRecipe.description || ""}
                                    placeholder="description"
                                    onChange={(e) =>
                                        setEditingRecipe({ ...editingRecipe, description: e.target.value })
                                    }
                                    label=""
                                />

                                {/* Instructions */}
                                <textarea
                                    className="create__recipe__card__instructions"
                                    name="instructions"
                                    value={editingRecipe.instructions || ""}
                                    placeholder="instructions"
                                    onChange={(e) =>
                                        setEditingRecipe({ ...editingRecipe, instructions: e.target.value })
                                    }
                                    required
                                />

                                {/* Time with "min" suffix */}
                                <div className="create__recipe__card__time">
                                    <InputField
                                        type="number"
                                        name="prepTimeMinutes"
                                        value={editingRecipe.prepTimeMinutes}
                                        placeholder="15"
                                        onChange={(e) =>
                                            setEditingRecipe({
                                                ...editingRecipe,
                                                prepTimeMinutes: parseInt(e.target.value) || 0
                                            })
                                        }
                                        label=""
                                    />
                                    <span
                                        className="input-suffix"
                                        style={{
                                            left: `calc(30px + ${String(editingRecipe.prepTimeMinutes ?? '').length}ch)`
                                        }}
                                    >
                                        min
                                    </span>
                                </div>

                                {/* Difficulty */}
                                <select
                                    className="create__recipe__select"
                                    name="difficulty"
                                    value={editingRecipe.difficulty}
                                    onChange={(e) =>
                                        setEditingRecipe({ ...editingRecipe, difficulty: e.target.value })
                                    }
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>

                                {/* Action Buttons */}
                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingRecipe(null);
                                            setEditImageFile(null);
                                        }}
                                    >
                                        Abbrechen
                                    </button>
                                    <button type="submit" className="create__recipe__card__button">
                                        Speichern
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="error-toast">
                        {errorMessage}
                        <button onClick={() => setErrorMessage(null)}>×</button>
                    </div>
                )}

                <RecipeGrid
                    recipes={myRecipes}
                    onDelete={isOwnProfile ? handleDelete : undefined}
                    getImageUrl={getImageUrl}
                    onEdit={isOwnProfile ? handleEditClick : undefined}
                />
            </div>
        </div>
    );
};

export default Profile;