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
    onDelete: (id: number) => void;
    getImageUrl: (imagePath: string | null) => string;
}

function RecipeGrid({
    recipes,
    onDelete,
    getImageUrl
}: RecipeGridProps) {

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

                                <span>
                                    ⏱️ {recipe.prepTimeMinutes} Min
                                </span>

                                <span>
                                    📊 {recipe.difficulty}
                                </span>

                                <button
                                    className="delete-btn"
                                    onClick={() => onDelete(recipe.id)}
                                >
                                    <span
                                        className="Optionen__icon"
                                        title="Optionen anzeigen"
                                    />
                                </button>

                            </div>

                        </div>

                    </div>

                ))

            )}

        </div>
    );
}

export default RecipeGrid;