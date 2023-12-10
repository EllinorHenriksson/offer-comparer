import { OfferProps } from "../types";

const Offers = ({ offers, setOffers }: OfferProps) => {
  const handleClick = (fileName: string) => {
    //Route to offers/:filename
  }
  
  return (
    <div className="offers">
      <div className="offer-list">
        {
          offers.map(offer => (
            <li key={offer.fileName} onClick={() => handleClick(offer.fileName)}>{offer.fileName}</li>
          ))
        }
      </div>
    </div>
  );
}

export default Offers;