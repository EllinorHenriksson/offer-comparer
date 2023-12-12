import { Link } from "react-router-dom";
import { OfferProps } from "../types";

const Offers = ({ offers, setOffers }: OfferProps) => {  
  return (
    <div className="offers">
      <div>
        {
          offers.map(offer => (
            <div key={offer.fileName}>
            <Link to={`/offers/${offer.fileName}`}>{offer.fileName}</Link>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Offers;