import { Link } from "react-router-dom";

/**
 * Represent the Page Not Found page
 */
const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <h2>Page Not Found</h2>
      <p>Sorry, but the page you tried to visit could not be found</p>
      <Link to="/" className="large-button centered">Home</Link>
    </div>
  );
}

export default PageNotFound;