import { useEffect, useState, useContext } from "react";
import "./Home.scss";
import Follow from "../../components/follow/Following";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import optionenIcon from "../../assets/optionen-home.svg";
import homeImg from "../../assets/home-img.jpg";

interface Recipe {
  userId: number;
  userName?: string;
  userImageUrl: string | null;
  id: number;
  title: string;
  description: string;
  instructions: string;
  prepTimeMinutes: number;
  difficulty: string;
  imageUrl: string | null;
}

interface HomeProps {}

function Home({}: HomeProps) {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [activeRecipeId, setActiveRecipeId] = useState<number | null>(null);
  const [followedUserIds, setFollowedUserIds] = useState<number[]>([]);

  useEffect(() => {
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

    if (user) {
      fetch(`${API_BASE_URL}/api/follow/${user.id}`)
        .then((res) => {
          if (res.ok) return res.json();
          return [];
        })
        .then((followingList) => {
          const ids = followingList.map(
            (item: { followingId: number }) => item.followingId,
          );
          setFollowedUserIds(ids);
        })
        .catch((err) => console.error("Error fetching following list:", err));
    }
  }, [user]);

  const handleToggleFollow = (targetUserId: number, newStatus: boolean) => {
    if (newStatus) {
      setFollowedUserIds((prev) => [...prev, targetUserId]);
    } else {
      setFollowedUserIds((prev) => prev.filter((id) => id !== targetUserId));
    }
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const getUserInitial = (userName?: string) =>
    (userName?.trim().charAt(0) || "?").toUpperCase();

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
                <button
                  className="recipe-author-box-allrecipe"
                  onClick={() => {
                    navigate(`/recipe/${recipe.id}`);
                  }}
                >
                  <img
                    src={optionenIcon}
                    className="recipe-author-box__options"
                    alt="options"
                  />
                </button>
                <div className="follow-button">
                  <Follow
                    targetUserId={recipe.userId}
                    isFollowing={followedUserIds.includes(recipe.userId)}
                    onToggleFollow={handleToggleFollow}
                  />
                </div>
                <button
                  className="recipe-author-box__schowuser"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${recipe.userId}`);
                  }}
                >
                  <span
                    className={
                      recipe.userImageUrl
                        ? "recipe-author-box__avatar"
                        : "recipe-author-box__avatar recipe-author-box__avatar--initial"
                    }
                    style={
                      recipe.userImageUrl
                        ? { backgroundImage: `url(${getImageUrl(recipe.userImageUrl)})` }
                        : undefined
                    }
                    aria-hidden="true"
                  >
                    {!recipe.userImageUrl && getUserInitial(recipe.userName)}
                  </span>
                  <strong>{recipe.userName || "Unbekannt"}</strong>
                </button>
              </div>

              <div className="recipe-content">
                <div>
                  <p>{recipe.title}</p>
                  <p className="description">{recipe.description}</p>
                </div>
               <div>
                <span className="recipe-content_prepTimeMinutes">⏱️ {recipe.prepTimeMinutes} min</span>
                {recipe.imageUrl ? (
                  <img
                    src={getImageUrl(recipe.imageUrl)}
                    alt={recipe.title}
                    className="recipe-image"
                  />
                ) : (
                  <img
                    src={homeImg}
                    alt="Default Recipe"
                    className="recipe-image"
                  />
                )}
               </div>
                <button
                  className="recipe-content_recipe"
                  onClick={() => setActiveRecipeId(activeRecipeId === recipe.id ? null : recipe.id)}
                >
                  rezepte anzeigen
                </button>
                {activeRecipeId === recipe.id && (
                  <>
                    <p className="instructions">{recipe.instructions}</p>
                  </>
                )}
                <div className="recipe-content_viows">
                      <span> 4 coments </span>
                    <span> 4 schare </span>
                   <span className="content_viows-number"> 150 </span>
                  <span className="content_viows-licke_icon" />      
                </div>
                <div className="recipe-content_actions">
                  <button type="button" className="viows-btn">
                    <span className="viows-btn__icon viows-btn__icon--share" />
                    <span className="content_viows-number">4</span>
                  </button>
                   <button type="button" className="viows-btn">
                    <span className="viows-btn__icon viows-btn__icon--comment" />
                    <span className="content_viows-number">4</span>
                  </button>
                     <button type="button" className="viows-btn ">
                    <span className="viows-btn__icon" />
                    <span className="content_viows-number">150</span>
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

export default Home;
