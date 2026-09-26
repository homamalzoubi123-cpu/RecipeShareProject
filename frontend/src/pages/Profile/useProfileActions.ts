import { useContext } from "react";
import { API_BASE_URL } from "../../config";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import type { Recipe } from "./Profile.types";

/**
 * Alle schreibenden Aktionen der Profilseite (Rezept löschen/aktualisieren,
 * Profilbild hochladen). Wirft bei Fehlern, das Aufrufen-Handling liegt
 * beim Container.
 */
export const useProfileActions = () => {
  const { token } = useContext(AuthContext) as AuthContextType;

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || token}`,
  });

  const uploadProfileImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/api/users/upload-profile-image`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Fehler beim Hochladen (Status ${res.status})`,
      );
    }

    const data = await res.json();
    return data.imageUrl;
  };

  // Bearbeitung des Rezepts per FormData (inklusive Bild-Upload)
  const saveRecipe = async (
    recipe: Recipe,
    imageFile: File | null,
  ): Promise<Recipe> => {
    const formData = new FormData();
    formData.append("Title", recipe.title);
    formData.append("Description", recipe.description || "");
    formData.append("Instructions", recipe.instructions || "");
    formData.append("PrepTimeMinutes", recipe.prepTimeMinutes.toString());
    formData.append("Difficulty", recipe.difficulty);

    if (imageFile) {
      formData.append("ImageFile", imageFile);
    }

    const res = await fetch(`${API_BASE_URL}/api/recipes/${recipe.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!res.ok) throw new Error("Fehler beim Aktualisieren des Rezepts.");

    return res.json();
  };

  const deleteRecipe = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("Fehler beim Löschen des Rezepts.");
  };

  return { uploadProfileImage, saveRecipe, deleteRecipe };
};
