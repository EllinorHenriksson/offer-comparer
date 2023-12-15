import { useParams } from 'react-router-dom'
import { OfferType } from '../types';
import { useEffect, useState } from 'react';
import OfferPart from '../parts/OfferPart';
import { Link } from 'react-router-dom';

/**
 * Represents the Offer Details page.
 *
 * @param offers The offers that are currently uploaded to the application
 */
const OfferDetails = ({ offers }: { offers: OfferType[] }) => {
  const { id } = useParams();
  const [offer, setOffer] = useState<OfferType | null>(null)

  useEffect(() => {
    const result = offers.find(offer => offer.fileName === id)
    if (result) {
      setOffer(result)      
    }
  }, [offers, id])

  return (
    <div className="offer-details">
      <h2>Offer Details</h2>
      {!offer && <div>
        <p>Sorry, the offer you wanted to view could not be found</p>
        <Link to="/offers" className='large-button centered'>Offers</Link>
      </div>}
      {offer && <OfferPart offer={offer}></OfferPart>}
    </div>
  );
}

export default OfferDetails;