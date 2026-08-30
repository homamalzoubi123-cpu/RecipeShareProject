import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import InputField from "../Components/InputField/InputField";
import { API_BASE_URL } from "../config";
interface RegisterProps {

}
const Register = ({ }: RegisterProps) => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwörter stimmen nicht überein!");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data || "Registrierung fehlerhaft");
            }

            setSuccess("Konto erfolgreich erstellt! Sie werden weitergeleitet...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            if (err instanceof Error)
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

                {error && <div style={{ color: "#e74c3c", marginBottom: "1rem" }}>{error}</div>}
                {success && <div style={{ color: "#2ecc71", marginBottom: "1rem" }}>{success}</div>}

                <InputField
                    label="Benutzername"
                    type="text"
                    name="username"
                    placeholder="Benutzername"
                    value={formData.username}
                    onChange={handleChange}
                />

                <InputField
                    label="E-Mail-Adresse"
                    type="email"
                    name="email"
                    placeholder="E-Mail-Adresse"
                    value={formData.email}
                    onChange={handleChange}
                />

                <InputField
                    label="Passwort"
                    type="password"
                    name="password"
                    placeholder="Passwort"
                    value={formData.password}
                    onChange={handleChange}
                />

                <InputField
                    label="Passwort bestätigen"
                    type="password"
                    name="confirmPassword"
                    placeholder="Passwort bestätigen"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

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