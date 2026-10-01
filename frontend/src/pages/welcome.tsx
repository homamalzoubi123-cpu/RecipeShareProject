import nurlogo from "../assets/brand/nurlogo.png";
import "./welcome.scss";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "search",
    title: "Rezepte suchen",
    text: "Durchsuche Millionen von Rezepten nach Zutat, Küche oder Gericht.",
  },
  {
    icon: "share",
    title: "Rezepte teilen",
    text: "Poste deine Kreationen und lass die Community kochen und bewerten.",
  },
  {
    icon: "cook",
    title: "Kochen lernen",
    text: "Schritt-für-Schritt-Anleitungen, die auch beim ersten Mal klappen.",
  },
  {
    icon: "chef",
    title: "Köche finden",
    text: "Entdecke Talente, folge ihren Favoriten und kochiere sie nach.",
  },
  {
    icon: "people",
    title: "Menschen kennenlernen",
    text: "Tausche dich aus, Like die Community und werde Teil der Szene.",
  },
];

const Welcome = () => {
  return (
    <div className="welcome">
      <section className="welcome__hero">
        <div className="welcome__container">
          <img
            className="welcome__logo"
            src={nurlogo}
            alt="Recipe Share Logo"
          />

          <h1 className="welcome__title">
            <span className="line1">Recipe</span>
            <span className="line2">Share</span>
          </h1>

          <p className="welcome__tagline">Cook. Share. Discover.</p>
          <p className="welcome__text">
            Teile deine Lieblingsrezepte <br /> und entdecke neue Rezepte
          </p>

          <div className="welcome__actions">
            <Link to="/login" className="welcome__cta">
              Jetzt anmelden
            </Link>
            <a href="#features" className="welcome__cta welcome__cta--ghost">
              Was es gibt
            </a>
          </div>
        </div>
      </section>

      <section className="welcome__features" id="features">
        <h2 className="welcome__features__title">Deine soziale Kochwelt</h2>
        <p className="welcome__features__lead">
          Alles, was du brauchst, um zu kochen, zu teilen und dich auszutauschen.
        </p>

        <div className="welcome__features__grid">
          {features.map((feature) => (
            <article key={feature.icon} className="welcome__feature">
              <span
                className={`welcome__feature__icon welcome__feature__icon--${feature.icon}`}
              />
              
              <h3 className="welcome__feature__name">{feature.title}</h3>
              <p className="welcome__feature__text">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Welcome;
