import nurlogo from "../assets/nurlogo.png";
import imagegruppe from "../assets/imagegruppe.jpeg";
import "./welcome.scss";
import Login from "./login";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";
interface WelcomeProps { }

const Welcome = ({ }: WelcomeProps) => {
    const { user } = useContext(AuthContext) as AuthContextType;
    return (
        <>
            <div className="welcome">
            <div className="welcome__container">
                <img className="welcome__logo" src={nurlogo} alt="Recipe Share Logo" />

                <h1 className="welcome__title">
                    <span className="line1">Recipe</span>
                    <span className="line2">Share</span>
                </h1>

                <p className="welcome__tagline">Cook. Share. Discover.</p>
                <p className="welcome__text">
                    Teile deine Lieblingsrezepte <br /> und entdecke neue Rezepte
                </p>
            </div>

            <div className="welcome__images">
                {/* <div className="card card--lasagna">
                 <img src={Lasagna} alt="Lasagna" />
                 </div>
                    <div className="card card--crepe">
                        <img src={Crip} alt="Crepe with Pancakes" />
                    </div>

                    <div className="card card--ramen">
                        <img src={HeartyRamen} alt="Hearty Ramen" />
                    </div>
                    */}
                <div className="card card--imagegruppe">
                    <img src={imagegruppe} alt="imagegruppe" />
                </div>
                </div>
                  <Login isInWelcome={true} />
            </div>
          
              
        </> 
    );
};

export default Welcome;