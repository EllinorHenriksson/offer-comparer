import { useParams } from 'react-router-dom'
import { OfferType } from '../types';
import { useEffect, useState } from 'react';
import OfferPart from '../parts/OfferPart';

const OfferDetails = ({ offers }: { offers: OfferType[] }) => {
  const { id } = useParams();
  const [offer, setOffer] = useState<OfferType | null>(null)

  useEffect(() => {
    const result = offers.find(offer => offer.fileName === id)
    if (result) {
      setOffer(result)
      console.log(result);
      
    }
  }, [offers, id])

  return (
    <div className="offer-details">
      {!offer && <p>Sorry, the offer you wanted to view could not be found</p>}
      {offer && <OfferPart offer={offer}></OfferPart>}
    </div>
  );
}

export default OfferDetails;