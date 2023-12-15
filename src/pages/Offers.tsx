import { Link } from "react-router-dom";
import { OfferType } from "../types";

/**
 * Represents the Offers page.
 *
 * @param offers The offers that are currently uploaded to the application
 */
const Offers = ({ offers }: {offers: OfferType[]}) => {
  return (
    <div className="offers">
      <h2>Offers</h2>
      {offers.length === 0 && <div>
        <p>No offers could be found</p>
        <Link to="/upload" className="large-button centered">Upload</Link>
      </div>}
      <div className="offer-preview-container">
        {offers.length > 0 &&
          offers.map(offer => (
            <Link to={`/offers/${offer.fileName}`} key={offer.fileName}>
              <p>{offer.fileName}</p>
              <div>{'\u2192'}</div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}

export default Offers;