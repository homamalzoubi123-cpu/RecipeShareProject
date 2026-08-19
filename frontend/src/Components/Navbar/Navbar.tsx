interface NavbarProps { }

const Navbar = ({ }: NavbarProps) =>  {
    return (
  <div className="navbar">
            <div className="navbar__Container">
                <span className="navbar__logo">RecipeShare</span>
                <div className="navbar_pages">
                    <span>Home</span>
                    <span>Recipes</span>
                    <span>Contact</span>
                    <span>About</span>
                  </div>
                    <div className="navbar__navItems">
                        <button className="navbar__navButton">Register</button>
                        <button className="navbar__navButton">Login</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar;