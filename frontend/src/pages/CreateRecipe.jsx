import "./CreateRecipe.scss";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function CreateRecipe() {
    const { token } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        instructions: "",
        prepTimeMinutes: 15,
        difficulty: "Easy",
        imageUrl: ""
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            // تحويل قيمة وقت التحضير إلى رقم صحيح
            [name]: type === "number" ? parseInt(value) || 0 : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5082/api/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("تمت إضافة الوصفة بنجاح!");
            } else {
                // طباعة خطأ الـ Backend لمعرفة السبب بدقة في Console
                const errorData = await response.json().catch(() => null);
                console.error("تفاصيل الخطأ من السيرفر:", response.status, errorData);
                alert(`حدث خطأ أثناء إضافة الوصفة (كود الخطأ: ${response.status})`);
            }
        } catch (error) {
            console.error("خطأ الاتصال بالخادم:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="title"
                placeholder="عنوان الوصفة"
                onChange={handleChange}
                required
            />
            <input
                name="description"
                placeholder="وصف قصير"
                onChange={handleChange}
            />
            <textarea
                name="instructions"
                placeholder="طريقة التحضير"
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="prepTimeMinutes"
                value={formData.prepTimeMinutes}
                placeholder="وقت التحضير بالدقائق"
                onChange={handleChange}
            />
            <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="Easy">سهل</option>
                <option value="Medium">متوسط</option>
                <option value="Hard">صعب</option>
            </select>
            <input
                name="imageUrl"
                placeholder="رابط الصورة"
                onChange={handleChange}
            />
            {/* تم إزالة onChange من الزر */}
            <button type="submit">حفظ الوصفة</button>
        </form>
    );
}

export default CreateRecipe;