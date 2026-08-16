import { useEffect, useState } from "react";
import "./Home.scss";

const API_BASE_URL = "http://localhost:5082";

function Home() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/recipes`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setRecipes(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching recipes:", err);
                setLoading(false);
            });
    }, []);

    // دالة لتكوين رابط الصورة بشكل صحيح
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image";
        if (imagePath.startsWith("http")) return imagePath;
        return `${API_BASE_URL}${imagePath}`;
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="home-container">
            <h2>All Recipes</h2>
            <div className="recipes-grid">
                {recipes.length === 0 ? (
                    <p>No recipes available.</p>
                ) : (
                    recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            <img
                                src={getImageUrl(recipe.imageUrl)}
                                alt={recipe.title}
                                className="recipe-image"
                            />
                            <div className="recipe-content">
                                <h3>{recipe.title}</h3>
                                <p className="description">{recipe.description}</p>
                                <p className="instructions">{recipe.instructions}</p>
                                <div className="recipe-info">
                                    <span>⏱️ {recipe.prepTimeMinutes} min</span>
                                    <span>📊 {recipe.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;