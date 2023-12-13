import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <h2>Home</h2>
      <p>Welcome to Offer Comparer, a tool that lets you upload different offers as CSV files to view and compare them.

        To get started, go to <Link to="/upload">Upload</Link> and upload the offers.</p>
    </div>
  );
}

export default Home;