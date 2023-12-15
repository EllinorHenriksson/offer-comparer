import { OfferType } from "../types";
import ProductPart from "./ProductPart";

/**
 * Represents an offer.
 * 
 * @param offer The offer to display
 */
const OfferPart = ({ offer }: { offer: OfferType }) => {
  return (
    <div className="offer-part">
      <h3>{offer.fileName}</h3>
      <div className="headings grid-container">
        <div>Name</div>
        <div>Description</div>
        <div>Failure rate (1/year)</div>
        <div>Quantity</div>
        <div>Price ($)</div>
      </div>
      <ProductPart data={offer.products} padding={5}></ProductPart>
      <div className="total-cost">Total cost: ${offer.cost}</div>
    </div>
  );
}

export default OfferPart;