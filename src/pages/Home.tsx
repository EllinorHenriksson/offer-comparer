import { Link } from "react-router-dom";

/**
 * Represents the Home page.
 */
const Home = () => {
  return (
    <div className="home">
      <h2>Home</h2>
      <p>Welcome to Offer Comparer, a tool that lets you upload different offers as CSV files to view and compare them.
        To get started, go to Upload and upload the offers.</p>
        <Link to="/upload" className="large-button centered">Upload</Link>
    </div>
  );
}

export default Home;