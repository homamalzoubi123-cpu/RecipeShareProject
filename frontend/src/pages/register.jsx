import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // التحديث التلقائي للحقول عند الكتابة
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    console.log("email", formData.email);
    console.log("password", formData.password);
    console.log("confirmPassword", formData.confirmPassword);
    // إرسال البيانات إلى الـ Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // 1. التحقق المحلي من كلمة المرور
        if (formData.password !== formData.confirmPassword) {
            setError("Passwörter stimmen nicht überein!");
            return;
        }

        setLoading(true);

        try {
            // 2. إرسال طلب POST إلى الـ API الخاص بك
            const response = await fetch("http://localhost:5082/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // إظهار نص الخطأ القادم من الـ Backend
                throw new Error(data.message || data || "Registrierung fehlerhaft");
            }

            // 3. النجاح وتوجيه المستخدم لصفحة تسجيل الدخول
            setSuccess("Konto erfolgreich erstellt! Sie werden weitergeleitet...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register">
            <form className="register__card" onSubmit={handleSubmit}>
                <Link to="/">
                    <button type="button" className="register__card__back">Zurück</button>
                </Link>

                <h2 className="register__card__title">Willkommen</h2>

                {/* رسائل الخطأ والنجاح */}
                {error && <div style={{ color: "#e74c3c", marginBottom: "1rem" }}>{error}</div>}
                {success && <div style={{ color: "#2ecc71", marginBottom: "1rem" }}>{success}</div>}

                <div className="register__card__field">
                    <label className="register__card__field__label">Benutzername</label>
                    <input
                        className="register__card__field__input"
                        type="text"
                        name="username"
                        placeholder="Benutzername"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="register__card__field">
                    <label className="register__card__field__label">E-Mail-Adresse</label>
                    <input
                        className="register__card__field__input"
                        type="email"
                        name="email"
                        placeholder="E-Mail-Adresse"
                       
                        onChange={handleChange}
                        required
                    />
                </div> 

                <div className="register__card__field">
                    <label className="register__card__field__label">Passwort</label>
                    <input
                        className="register__card__field__input"
                        type="password"
                        name="password"
                        placeholder="Passwort"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="register__card__field">
                    <label className="register__card__field__label">Passwort bestätigen</label>
                    <input
                        className="register__card__field__input"
                        type="password"
                        name="confirmPassword"
                        placeholder="Passwort bestätigen"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="register__card__button"
                    disabled={loading}
                >
                    {loading ? "Wird registriert..." : "Registrieren"}
                </button>
            </form>
        </div>
    );
};

export default Register;