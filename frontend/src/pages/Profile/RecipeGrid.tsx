import { useState, useRef, useEffect } from "react";
import "./RecipeGrid.scss";
import type { GetImageUrl, Recipe } from "./Profile.types";

interface RecipeGridProps {
  recipes: Recipe[];
  onDelete?: (id: number) => void;
  getImageUrl: GetImageUrl;
  onEdit?: (recipe: Recipe) => void;
}

const RecipeGrid = ({
  recipes,
  onDelete,
  getImageUrl,
  onEdit,
}: RecipeGridProps) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const isOwnProfile = !!onDelete;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId === null) return;

      const openMenuRef = menuRefs.current[openMenuId];

      if (openMenuRef && !openMenuRef.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className="my-recipes-grid">
      {recipes.length === 0 ? (
        <p>Du hast noch keine Rezepte geteilt.</p>
      ) : (
        recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <div className="recipe-card__header">
              <h3 className="recipe-card__title">{recipe.title}</h3>

              {isOwnProfile && (
                <div
                  className="recipe-options-wrapper"
                  ref={(el) => {
                    menuRefs.current[recipe.id] = el;
                  }}
                >
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === recipe.id ? null : recipe.id,
                      )
                    }
                  >
                    <span
                      className="recipe-card__options-icon"
                      title="Optionen anzeigen"
                    />
                  </button>

                  {openMenuId === recipe.id && (
                    <div className="recipe-options">
                      <button
                        type="button"
                        className="recipe-options__item"
                        onClick={() => {
                          onEdit?.(recipe);
                          setOpenMenuId(null);
                        }}
                      >
                        <span className="recipe-options__icon recipe-options__icon--edit" />
                        Bearbeiten
                      </button>

                      <button
                        type="button"
                        className="recipe-options__item recipe-options__item--delete"
                        onClick={() => {
                          onDelete?.(recipe.id);
                          setOpenMenuId(null);
                        }}
                      >
                        <span className="recipe-options__icon recipe-options__icon--delete" />
                        Löschen
                      </button>

                      <button
                        type="button"
                        className="recipe-options__item"
                        onClick={() => {
                          console.log("Teilen");
                          setOpenMenuId(null);
                        }}
                      >
                        <span className="recipe-options__icon recipe-options__icon--share" />
                        Teilen
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="recipe-card__body">
              <p className="recipe-card__description">{recipe.description}</p>
            </div>

            {recipe.imageUrl && (
              <div className="recipe-media">
                <p className="recipe-card__badge">
                  ⏱️ {recipe.prepTimeMinutes} Min
                </p>
                <img
                  src={getImageUrl(recipe.imageUrl)}
                  alt={recipe.title}
                  className="recipe-card__image"
                />
              </div>
            )}

            <div className="recipe-info">
              <div className="recipe-details">
                {!recipe.imageUrl && (
                  <span>⏱️ {recipe.prepTimeMinutes} Min</span>
                )}

                <span>📊 {recipe.difficulty}</span>
              </div>

              <button
                type="button"
                className="recipe-card__toggle"
                onClick={() =>
                  setExpandedId(expandedId === recipe.id ? null : recipe.id)
                }
              >
                {expandedId === recipe.id
                  ? "Zubereitung ausblenden"
                  : "Zubereitung anzeigen"}
              </button>
            </div>

            {expandedId === recipe.id && (
              <p className="recipe-card__instructions">{recipe.instructions}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RecipeGrid;
