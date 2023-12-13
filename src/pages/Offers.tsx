import { Link } from "react-router-dom";
import { OfferProps } from "../types";

const Offers = ({ offers, setOffers }: OfferProps) => {  
  return (
    <div className="offers">
      <h2>Offers</h2>
      <div>
        {
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