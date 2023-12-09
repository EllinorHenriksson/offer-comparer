import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Offer Comparer</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/offers">Offers</Link>
        <Link to="/compare">Compare</Link>
      </div>
    </nav>
  );
}

export default Navbar;