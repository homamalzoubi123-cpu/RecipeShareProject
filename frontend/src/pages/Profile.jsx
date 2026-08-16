import { useEffect, useState } from "react";
import "./Profile.scss";
const API_BASE_URL = "http://localhost:5082";

function Profile() {
    const [myRecipes, setMyRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(`${API_BASE_URL}/api/recipes/my-recipes`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Fehler beim Laden der eigenen Rezepte.");
                return res.json();
            })
            .then((data) => {
                setMyRecipes(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // 🗑️ Funktion zum Löschen eines Rezepts
    const handleDelete = async (id) => {
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

            // Rezept direkt aus dem State entfernen (UI aktualisieren)
            setMyRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/300x200?text=Kein+Bild";
        if (imagePath.startsWith("http")) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    if (loading) return <p>Lade Profil...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Mein Profil</h2>
                <p>Geteilte Rezepte: {myRecipes.length}</p>
            </div>

            <div className="my-recipes-grid">
                {myRecipes.length === 0 ? (
                    <p>Du hast noch keine Rezepte geteilt.</p>
                ) : (
                    myRecipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            <img
                                src={getImageUrl(recipe.imageUrl)}
                                alt={recipe.title}
                                className="recipe-image"
                            />
                            <div className="recipe-content">
                                <h3>{recipe.title}</h3>
                                <p>{recipe.description}</p>
                                <div className="recipe-info">
                                    <span>⏱️ {recipe.prepTimeMinutes} Min</span>
                                    <span>📊 {recipe.difficulty}</span>
                                </div>
                                {/* 🗑️ Löschen-Button */}
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(recipe.id)}
                                >
                                    🗑️ Löschen
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Profile;