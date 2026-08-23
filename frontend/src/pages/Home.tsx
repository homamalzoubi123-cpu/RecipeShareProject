import { useEffect, useState, useContext } from "react";
import "./Home.scss";
import Follow from "../Components/Follow/Following";
import { AuthContext, AuthContextType } from "../context/AuthContext";

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

interface HomeProps { }

function Home({ }: HomeProps) {
    const { user } = useContext(AuthContext) as AuthContextType;
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // قائمة تجمع أرقام الأشخاص الذين نتابعهم
    const [followedUserIds, setFollowedUserIds] = useState<number[]>([]);

    useEffect(() => {
        // 1. جلب الوصفات
        fetch(`${API_BASE_URL}/api/recipes`)
            .then((res) => res.json())
            .then((data: Recipe[]) => {
                setRecipes(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching recipes:", err);
                setLoading(false);
            });

        // 2. جلب قائمة الأشخاص الذين يتابعهم المستخدم الحالي مرة واحدة
        if (user) {
            fetch(`${API_BASE_URL}/api/follow/${user.id}`)
                .then((res) => {
                    if (res.ok) return res.json();
                    return [];
                })
                .then((followingList) => {
                    // استخراج الـ followingId فقط ووضعه في قائمة
                    const ids = followingList.map((item: { followingId: number }) => item.followingId);
                    setFollowedUserIds(ids);
                })
                .catch((err) => console.error("Error fetching following list:", err));
        }
    }, [user]);

    // دالة تحديث قائمة المتابعة لجميع المنشورات في الصفحة
    const handleToggleFollow = (targetUserId: number, newStatus: boolean) => {
        if (newStatus) {
            // إضافة المستخدم للـ Array
            setFollowedUserIds((prev) => [...prev, targetUserId]);
        } else {
            // إزالة المستخدم من الـ Array
            setFollowedUserIds((prev) => prev.filter((id) => id !== targetUserId));
        }
    };

    const getImageUrl = (imagePath: string | null) => {
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
                            <div className="recipe-author-box">
                                <strong>{recipe.userName || "Unbekannt"}</strong>

                                {/* نمرر إذا ما كان userId موجود داخل قائمة المتابعة */}
                                <div className="follow-button">
                                <Follow
                                    
                                    targetUserId={recipe.userId}
                                    isFollowing={followedUserIds.includes(recipe.userId)}
                                    onToggleFollow={handleToggleFollow}
                                    />
                               </div>
                            </div>
                            {recipe.imageUrl && (
                                <img
                                    src={getImageUrl(recipe.imageUrl)}
                                    alt={recipe.title}
                                    className="recipe-image"
                                />
                            )}
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