import "./login.scss";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="login">
            <div className="login__card">
                <Link to="/">
                <button className="login__card__back">Zurück</button>
            </Link>
                <h2 className="login__title">Willkommen</h2>
                <div className="login__card__field">
                    <label className="login__card__label">E-Mail-Adresse</label>
                    <input
                        className="login__card__input"
                        type="email"
                        placeholder="E-Mail-Adresse" />
                </div>
                <div className="login__card__field">
                    <div className="login__card__label__row">
                        <label className="login__card__label">Passwort</label>
                        <a className="login__link__passwort" href="#">Passwort vergessen?</a>
                    </div>
                    <input
                        className="login__card__input"
                        type="password"
                        placeholder="Passwort" />
                </div>
                <button className="login__card__button">Login</button>
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