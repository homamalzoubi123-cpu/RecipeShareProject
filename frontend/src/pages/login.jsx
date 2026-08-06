import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import InputField from "../Components/InputField/InputField";
import { usecontext } from "react";
import { AuthContext } from "../context/AuthContext"; 
const Login = (
    
) => {
    const { login } = usecontext(AuthContext);
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
       
            const response = await fetch("http://localhost:5082/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                 
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();
            localStorage.setItem("token", data.token);
           
            if (!response.ok) {
                
                throw new Error(data.message || data || "Registrierung fehlerhaft");
            }
            login(data.user, data.token);
            setSuccess("Erfolgreich angemeldet! Sie werden weitergeleitet...");
            setTimeout(() => {
                navigate("/");
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
                <h2
                    className="login__title">
                    Willkommen
                </h2>
                {error &&
                    <div
                        style={{
                            color: "#e74c3c",
                            marginBottom: "1rem"
                        }}>
                        {error}
                    </div>
                }
                {success &&
                    <div
                        style={{
                            color: "#2ecc71",
                            marginBottom: "1rem"
                        }}>
                        {success}
                    </div>}

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
                <div
                    className="login__card__label__row">
                    <a
                        className="login__link__passwort"
                        href="#">
                        Passwort vergessen?
                    </a>
                </div>
               
                <button
                    type="submit"
                    disabled={loading}
                    className="login__card__button"
                    onClick={handleSubmit}>
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