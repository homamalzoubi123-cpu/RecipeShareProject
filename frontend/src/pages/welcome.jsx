import nurlogo from "../assets/nurlogo.png";
import { Link } from "react-router-dom";
import "./welcome.css"
function Welcome() {
    return (
        <div className="welcome">
            <img src={nurlogo} alt="logo" />
            <h1 className="welcome__title">
                <span className="welcome__title_r">R</span>
                <span className="welcome__title_e">e</span>
                <span className="welcome__title_c">c</span>
                <span className="welcome__title_i">i</span>
                <span className="welcome__title_p">p</span>
                <span className="welcome__title_e">e</span>
                <span className="welcome__title_Hub">Hub</span>
           </h1>
            <p> <span className="welcome__title_Cook">Cook</span> •  <span className="welcome__title_Share">Share</span></p>
            <p className="welcome__text">Teile deine lieblingsrezepte und entdecke neue Rezepte</p>
            <div className="welcome__buttons">
                <Link to="/login" >
                    <button className="welcome__button__Anmeldung">Anmeldung</button>
                </Link>
                <Link to="/register" >
                    <button className="welcome__button__Registrieren">Registrieren</button>
                </Link>
            </div>
           
        </div>
  )
}

export default Welcome