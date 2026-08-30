import "./CreateRecipe.scss";
import { useState, useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import InputField from "../Components/InputField/InputField";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

interface CreateRecipeProps {

}
function CreateRecipe({

}: CreateRecipeProps) {
    const { token } = useContext(AuthContext) as AuthContextType;
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        instructions: "",
        prepTimeMinutes: 15,
        difficulty: "Easy"
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseInt(value) || 0 : value
        }));
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form Submitted! Data:", formData); // للتأكد من تنفيذ الدالة

        setLoading(true);

        const data = new FormData();
        data.append("Title", formData.title);
        data.append("Description", formData.description || "");
        data.append("Instructions", formData.instructions);
        data.append("PrepTimeMinutes", formData.prepTimeMinutes.toString());
        data.append("Difficulty", formData.difficulty);

        if (imageFile) {
            data.append("ImageFile", imageFile);
        }

        try {
            const headers: Record<string, string> = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/recipes`, {
                method: "POST",
                headers: headers,
                body: data
            });

            console.log("response status:", response.status);

            if (response.ok) {
                const resData = await response.json();
                console.log("Saved Recipe:", resData);
                alert("تمت إضافة الوصفة بنجاح!");
            } else {
                const errorText = await response.text();
                console.error("Server Error:", errorText);
                alert(`حدث خطأ أثناء الإرسال: ${response.status}`);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            alert("فشل الاتصال بالخادم!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create__recipe__container">
            <div className="create__recipe__card">
                <Link to="/">
                    <button type="button" className="login__card__back">Zurück</button>
                </Link>
                <h2 className="login__title">neue Rezept erstellen</h2>

                <form onSubmit={handleSubmit}>
                    <InputField
                        name="title"
                        value={formData.title}
                        placeholder="title"
                        onChange={handleChange}
                        required
                        label={""}
                    />

                    <InputField
                        name="description"
                        value={formData.description}
                        placeholder="description"
                        onChange={handleChange} label={""} />
                    <textarea
                        className="create__recipe__card__instructions"
                        name="instructions"
                        value={formData.instructions}
                        placeholder="instructions"
                        onChange={handleChange}
                        required
                    />
                    <div className="create__recipe__card__time">
                        <InputField
                            type="number"
                            name="prepTimeMinutes"
                            value={formData.prepTimeMinutes}
                            placeholder="15"
                            onChange={handleChange}
                            label=""
                        />
                        <span
                            className="input-suffix"
                            style={{
                                left: `calc(30px + ${String(formData.prepTimeMinutes ?? '').length}ch)`
                            }}
                        >
                            min
                        </span>
                    </div>
                    <select name="difficulty" value={formData.difficulty}
                        onChange={handleChange}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="create__recipe__file__input"
                    />

                    <button
                        className="create__recipe__card__button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "wird gespeichert..." : "speichern"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateRecipe;