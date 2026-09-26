import { useRef, useState } from "react";
import InputField from "../../components/input-field/InputField";
import type { GetImageUrl, Recipe } from "./Profile.types";

interface EditRecipeModalProps {
  recipe: Recipe;
  getImageUrl: GetImageUrl;
  onSave: (recipe: Recipe, imageFile: File | null) => Promise<void>;
  onClose: () => void;
}

const EditRecipeModal = ({
  recipe,
  getImageUrl,
  onSave,
  onClose,
}: EditRecipeModalProps) => {
  const [editingRecipe, setEditingRecipe] = useState<Recipe>({ ...recipe });
  const [originalRecipe] = useState<Recipe>({ ...recipe }); // Unveränderte Kopie als Referenz
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null); // Ref für Bild-Upload

  const isUnchanged =
    editingRecipe.title === originalRecipe.title &&
    (editingRecipe.description || "") === (originalRecipe.description || "") &&
    (editingRecipe.instructions || "") ===
      (originalRecipe.instructions || "") &&
    editingRecipe.prepTimeMinutes === originalRecipe.prepTimeMinutes &&
    editingRecipe.difficulty === originalRecipe.difficulty &&
    !editImageFile; // Prüft, ob kein neues Bild hochgeladen wurde

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUnchanged) return;

    try {
      await onSave(editingRecipe, editImageFile);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Fehler beim Aktualisieren des Rezepts.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="profile__edit-modal">
        <button type="button" className="close-button" onClick={onClose}>
          ×
        </button>
        <h3>Rezept bearbeiten</h3>

        <form onSubmit={handleSubmit}>
          {/* Verstecktes File-Input für den Klick auf das Bild */}
          <input
            type="file"
            accept="image/*"
            ref={editFileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setEditImageFile(e.target.files[0]);
              }
            }}
          />

          {/* Klickbarer Bild-Container mit Overlay */}
          <div
            className="profile__edit-image-container"
            onClick={() => editFileInputRef.current?.click()}
            title="Klicke hier, um das Bild zu ändern"
          >
            <img
              src={
                editImageFile
                  ? URL.createObjectURL(editImageFile)
                  : getImageUrl(editingRecipe.imageUrl)
              }
              alt="Rezeptbild"
            />
            <div className="image-overlay">
              <span>Bild ändern</span>
            </div>
          </div>

          {/* Title */}
          <InputField
            type="text"
            name="title"
            value={editingRecipe.title}
            placeholder="title"
            onChange={(e) =>
              setEditingRecipe({ ...editingRecipe, title: e.target.value })
            }
            required
            label=""
          />

          {/* Description */}
          <InputField
            type="text"
            name="description"
            value={editingRecipe.description || ""}
            placeholder="description"
            onChange={(e) =>
              setEditingRecipe({
                ...editingRecipe,
                description: e.target.value,
              })
            }
            required
            label=""
          />

          {/* Instructions */}
          <textarea
            className="profile__edit-instructions"
            name="instructions"
            value={editingRecipe.instructions || ""}
            placeholder="instructions"
            onChange={(e) =>
              setEditingRecipe({
                ...editingRecipe,
                instructions: e.target.value,
              })
            }
            required
          />

          {/* Time with "min" suffix */}
          <div className="profile__edit-time">
            <InputField
              type="number"
              name="prepTimeMinutes"
              value={editingRecipe.prepTimeMinutes}
              placeholder="15"
              onChange={(e) =>
                setEditingRecipe({
                  ...editingRecipe,
                  prepTimeMinutes: parseInt(e.target.value) || 0,
                })
              }
              label=""
            />
            <span
              className="input-suffix"
              style={{
                left: `calc(30px + ${String(editingRecipe.prepTimeMinutes ?? "").length}ch)`,
              }}
            >
              min
            </span>
          </div>

          {/* Difficulty */}
          <select
            className="profile__edit-select"
            name="difficulty"
            value={editingRecipe.difficulty}
            onChange={(e) =>
              setEditingRecipe({
                ...editingRecipe,
                difficulty: e.target.value,
              })
            }
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isUnchanged}
              className={`profile__edit-submit-btn ${isUnchanged ? "disabled" : ""}`}
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipeModal;
