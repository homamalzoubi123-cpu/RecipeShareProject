import { useRef, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.scss";
import ProfileHeader from "./ProfileHeader";
import RecipeGrid from "./RecipeGrid";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EditRecipeModal from "./EditRecipeModal";
import ErrorToast from "./ErrorToast";
import { useProfileData } from "./useProfileData";
import { useProfileActions } from "./useProfileActions";
import type { GetImageUrl, Recipe } from "./Profile.types";
import { API_BASE_URL } from "../../config";

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const isOwnProfile = !userId; // Keine ID in der URL = eigenes Profil

  const {
    recipes,
    setRecipes,
    userProfile,
    setUserProfile,
    followersCount,
    followingCount,
    loading,
    error,
  } = useProfileData({ userId, isOwnProfile });

  const { uploadProfileImage, saveRecipe, deleteRecipe } = useProfileActions();

  const recipesGridRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrollToRecipes = () => {
    recipesGridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const getImageUrl: GetImageUrl = (imagePath) => {
    if (!imagePath) return "https://picsum.photos/300/200";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadProfileImage(file);
      setUserProfile((prev) => ({ ...prev, imageUrl }));
    } catch (err: unknown) {
      console.error("Upload-Fehler:", err);
      alert(err instanceof Error ? err.message : "Unbekannter Fehler");
    }
  };

  const handleSaveRecipe = async (
    recipe: Recipe,
    imageFile: File | null,
  ) => {
    const updatedRecipe = await saveRecipe(recipe, imageFile);

    // Rezept-Liste lokal aktualisieren
    setRecipes((prev) =>
      prev.map((r) => (r.id === recipe.id ? updatedRecipe : r)),
    );
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteId === null) return;

    try {
      await deleteRecipe(confirmDeleteId);
      setRecipes((prev) =>
        prev.filter((recipe) => recipe.id !== confirmDeleteId),
      );
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Unbekannter Fehler",
      );
    } finally {
      setConfirmDeleteId(null);
    }
  };

  if (loading) return <p>Lade Profil...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div
      className={`profile-container ${!isOwnProfile ? "profile-container__own-profile" : ""}`}
    >
      {!isOwnProfile && (
        <button className="back-button_profile" onClick={() => navigate(-1)}>
          zum mein Profil
        </button>
      )}
      <ProfileHeader
        userProfile={userProfile}
        recipesCount={recipes.length}
        followersCount={followersCount}
        followingCount={followingCount}
        fileInputRef={fileInputRef}
        onImageUpload={isOwnProfile ? handleImageUpload : undefined}
        onRecipesClick={scrollToRecipes}
        onFollowersClick={() => {
          if (userProfile.id) {
            navigate(`/profile/${userProfile.id}/followers`);
          }
        }}
        onFollowingClick={() => {
          if (userProfile.id) {
            navigate(`/profile/${userProfile.id}/following`);
          }
        }}
        getImageUrl={getImageUrl}
      />

      <div ref={recipesGridRef}>
        {/* Modal für Lösch-Bestätigung */}
        {confirmDeleteId !== null && (
          <ConfirmDeleteModal
            onClose={() => setConfirmDeleteId(null)}
            onConfirm={handleConfirmDelete}
          />
        )}

        {/* Modal für Rezept bearbeiten */}
        {editingRecipe && (
          <EditRecipeModal
            key={editingRecipe.id}
            recipe={editingRecipe}
            getImageUrl={getImageUrl}
            onSave={handleSaveRecipe}
            onClose={() => setEditingRecipe(null)}
          />
        )}

        {errorMessage && (
          <ErrorToast
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}

        <RecipeGrid
          recipes={recipes}
          onDelete={isOwnProfile ? (id: number) => setConfirmDeleteId(id) : undefined}
          getImageUrl={getImageUrl}
          onEdit={isOwnProfile ? setEditingRecipe : undefined}
        />
      </div>
    </div>
  );
};

export default Profile;
