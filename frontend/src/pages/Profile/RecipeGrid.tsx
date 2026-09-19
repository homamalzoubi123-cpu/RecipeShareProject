import { useState, useRef, useEffect } from "react";
import "./RecipeGrid.scss";

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

interface RecipeGridProps {
    recipes: Recipe[];
    onDelete?: (id: number) => void;
    getImageUrl: (imagePath: string | null) => string;
    onEdit?: (recipe: Recipe) => void;
}

const RecipeGrid = ({
    recipes,
    onDelete,
    getImageUrl,
    onEdit
}: RecipeGridProps) => {

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const isOwnProfile = !!onDelete;

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            if (openMenuId === null) return;

            const openMenuRef = menuRefs.current[openMenuId];

            if (
                openMenuRef &&
                !openMenuRef.contains(event.target as Node)
            ) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, [openMenuId]);


    return (
        <div className="my-recipes-grid">

            {recipes.length === 0 ? (

                <p>Du hast noch keine Rezepte geteilt.</p>

            ) : (

                recipes.map((recipe) => (

                    <div
                        key={recipe.id}
                        className="recipe-card" 
                    >

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

                                <div className="recipe-details">
                                    <span>
                                        ⏱️ {recipe.prepTimeMinutes} Min
                                    </span>

                                    <span>
                                        📊 {recipe.difficulty}
                                    </span>
                                </div>

                                {isOwnProfile && (

                                    <div
                                        className="recipe-options-wrapper"
                                        ref={(el) => {
                                            menuRefs.current[recipe.id] = el;
                                        }}
                                    >

                                        {/* زر القائمة */}
                                        <button
                                            type="button"
                                            className="delete-btn"
                                            onClick={() =>
                                                setOpenMenuId(
                                                    openMenuId === recipe.id
                                                        ? null
                                                        : recipe.id
                                                )
                                            }
                                        >
                                            <span
                                                className="Optionen__icon"
                                                title="Optionen anzeigen"
                                            />

                                        </button>
                                        
                                        {/* القائمة المنسدلة */}
                                        {openMenuId === recipe.id && (

                                            <div className="recipe-options">

                                                {/* زر التعديل */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onEdit?.(recipe);
                                                        setOpenMenuId(null);
                                                    }}
                                                >
                                                    Bearbeiten
                                                </button>


                                                {/* زر الحذف */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onDelete?.(recipe.id);
                                                        setOpenMenuId(null);
                                                    }}
                                                >
                                                    Löschen
                                                </button>


                                                {/* زر المشاركة */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        console.log("Teilen");
                                                        setOpenMenuId(null);
                                                    }}
                                                >
                                                    Teilen
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                ))

            )}

        </div>
    );
}

export default RecipeGrid;