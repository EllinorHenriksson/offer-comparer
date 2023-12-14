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
  }, [offers, id])

  return (
    <div className="offer-details">
      {!offer && <p>Sorry, the offer you wanted to view could not be found</p>}
      {offer && <div>
        <h2>{offer.fileName}</h2>
        <table className='offer-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Parent</th>
            <th>Description</th>
            <th>Failure rate (1/year)</th>
            <th>Quantity</th>
            <th>Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {offer.parts.map((part, partID) => (
            <tr key={partID}>
              <td>{part.name}</td>
              <td>{part.type}</td>
              <td>{part.parent}</td>
              <td>{part.description}</td>
              <td>{part.failureRate}</td>
              <td>{part.quantity}</td>
              <td>{part.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>Total cost: ${offer.cost}</div>
      </div>
      }
    </div>
  );
}

export default OfferDetails;