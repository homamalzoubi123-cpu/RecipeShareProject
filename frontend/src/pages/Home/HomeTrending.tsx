import "./HomeTrending.scss";

const TrendingList = [
  { rank: 1, name: "#Ramadan" },
  { rank: 2, name: "#Vegan" },
  { rank: 3, name: "#Dessert" },
  { rank: 4, name: "#Healthy" },
  { rank: 5, name: "#QuickMeals" },
];

const HomeTrending = () => {
  return (
    <div className="home-trending-container">
      <div className="trending-recipes-grid">
        <h3>Trending Recipes</h3>
        {TrendingList.map((recipe) => (
          <div key={recipe.rank} className="trending-recipe">
            <span className="trending-recipe__name">{recipe.name}</span>
            <span className="trending-recipe__key">{recipe.rank}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeTrending;