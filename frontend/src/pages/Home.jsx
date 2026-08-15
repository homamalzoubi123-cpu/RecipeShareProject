import { useEffect, useState } from "react";
import "./Home.scss"; // لتنسيق الكروت والشبكة

function Home() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    // جلب الوصفات من الـ Backend عند تحميل الصفحة
    useEffect(() => {
        fetch("http://localhost:5000/api/recipes")
            .then((res) => res.json())
            .then((data) => {
                setRecipes(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("خطأ في جلب البيانات:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>جاري تحميل الوصفات...</p>;

    return (
        <div className="home-container">
            <h2>أحدث الوصفات</h2>
            <div className="recipes-grid">
                {recipes.length === 0 ? (
                    <p>لا توجد وصفات مضافة بعد.</p>
                ) : (
                    recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            <img
                                src={recipe.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                                alt={recipe.title}
                                className="recipe-image"
                            />
                            <div className="recipe-content">
                                <h3>{recipe.title}</h3>
                                <p className="description">{recipe.description}</p>

                                <div className="recipe-info">
                                    <span>⏱️ {recipe.prepTimeMinutes} دقيقة</span>
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