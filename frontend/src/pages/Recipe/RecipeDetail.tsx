import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";
import "./RecipeDetail.scss";

interface RecipeDetailData {
  id: number;
  userId: number;
  userName: string;
  title: string;
  description: string;
  instructions: string;
  prepTimeMinutes: number;
  difficulty: string;
  imageUrl?: string;
  createdAt: string;
}

function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { token } = useContext(AuthContext) as AuthContextType;
  const [recipe, setRecipe] = useState<RecipeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
          headers,
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Rezept nicht gefunden.");
          } else {
            setError("Fehler beim Laden des Rezepts.");
          }
          setRecipe(null);
          return;
        }

        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Verbindung zum Server fehlgeschlagen.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, token]);

  if (loading) {
    return <div className="recipe-detail__status">Wird geladen...</div>;
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail__status">
        <p>{error ?? "Rezept nicht gefunden."}</p>
        <Link to="/">
          <button type="button">Zurück zur Startseite</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="recipe-detail__container">
      <div className="recipe-detail__card">
        <Link to="/">
          <button type="button" className="recipe-detail__back">
            zum mein profil
          </button>
        </Link>

        {recipe.imageUrl && (
          <img
            src={`${API_BASE_URL}${recipe.imageUrl}`}
            alt={recipe.title}
            className="recipe-detail__image"
          />
        )}

        <h2 className="recipe-detail__title">{recipe.title}</h2>
        <p className="recipe-detail__author">von {recipe.userName}</p>

        {recipe.description && (
          <p className="recipe-detail__description">{recipe.description}</p>
        )}

        <div className="recipe-detail__meta">
          <span>⏱️ {recipe.prepTimeMinutes} min</span>
          <span>📊 {recipe.difficulty}</span>
        </div>

        <h3>Zubereitung</h3>
        <p className="recipe-detail__instructions">{recipe.instructions}</p>
      </div>
    </div>
  );
}

export default RecipeDetail;
