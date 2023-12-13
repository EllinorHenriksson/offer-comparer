import { useParams } from 'react-router-dom'
import { Offer } from '../types';
import { useEffect, useState } from 'react';

const OfferDetails = ({ offers }: { offers: Offer[] }) => {
  const { id } = useParams();
  const [offer, setOffer] = useState<Offer | null>(null)


  useEffect(() => {
    const result = offers.find(offer => offer.fileName === id)
    if (result) {
      setOffer(result)
    }
  }, [id, offers])

  return (
    <div className="offer-details">
      <h2>{id}</h2>
      {!offer && <p>Sorry, the offer you wanted to view could not be found</p>}
      {offer && <div className='offer-table'>
        {offer.fileName}
      </div>}
    </div>
  );
}

export default OfferDetails;