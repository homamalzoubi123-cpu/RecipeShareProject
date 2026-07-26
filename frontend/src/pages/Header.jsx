import nurlogo from "../assets/nurlogo.png";
import Pourder from "../assets/pourder.svg";
import acaunt from "../assets/account.svg";
import home from "../assets/home.svg";
import "./Header.scss"

function Header() {
    return (
            <header className="header__container">
                <img className="header__container__logo" src={nurlogo} alt="logo" />
            <h2 className="header__container__title">Recipe Share</h2>
            < input className="header__container__search" type="text" placeholder="Search for recipes..." />
            <img className="header__container__home" src={home} alt="home" />
            <img className="header__container__account" src={acaunt} alt="account" />
            <img className="header__container__pourder" src={Pourder} alt="pourder" />
            </header>
  );
}

export default Header;