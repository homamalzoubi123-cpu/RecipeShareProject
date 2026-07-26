import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

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
        <div className="login">
            <div className="login__card">
                <Link to="/">
                <button className="login__card__back">Zurück</button>
            </Link>
                <h2 className="login__title">Willkommen</h2>
                {error && <div style={{ color: "#e74c3c", marginBottom: "1rem" }}>{error}</div>}
                {success && <div style={{ color: "#2ecc71", marginBottom: "1rem" }}>{success}</div>}

                <div className="login__card__field">
                    <label className="login__card__label">E-Mail-Adresse</label>
                    <input
                        className="login__card__input"
                        type="email"
                        placeholder="E-Mail-Adresse"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="login__card__field">
                    <div className="login__card__label__row">
                        <label className="login__card__label">Passwort</label>
                        <a className="login__link__passwort" href="#">Passwort vergessen?</a>
                    </div>
                    <input
                        className="login__card__input"
                        type="password"
                        placeholder="Passwort"
                        name="password"
                        value={formData.password}
                        required
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit" disabled={loading}
                    className="login__card__button" onClick={handleSubmit}>
                {loading ? "Anmelden..." : "Anmelden"}
                </button>
                <p className="login__card__footer">
                    Noch kein Konto?
                    <a
                        className="login__card__link"
                        href="/register">Registrieren
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;