import { Link } from "react-router-dom";
import "./register.scss";

const Register = () => {
    return (
        <div className="register">
            <div className="register__card">
                <Link to="/">
                    <button className="register__card__back">Zurück</button>
                </Link>
                <h2 className="register__card__title">Willkommen</h2>
                <div className="register__card__field">
                    <label className="register__card__field__label">E-Mail-Adresse</label>
                    <input
                        className="register__card__field__input"
                        type="email"
                        placeholder="E-Mail-Adresse" />
                </div>
                <div className="register__card__field">
                    <label className="register__card__field__label">Passwort</label>
                    <input
                        className="register__card__field__input"
                        type="password"
                        placeholder="Passwort" />
                </div>
                <div className="register__card__field">
                    <label className="register__card__field__label">Passwort bestätigen</label>
                    <input
                        className="register__card__field__input"
                        type="password"
                        placeholder="Passwort bestätigen" />
                </div>
                <button className="register__card__button">Registrieren</button>
            </div>
        </div>
    );
};
export default Register;