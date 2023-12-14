import { OfferType } from "../types";
import ProductPart from "./ProductPart";

const OfferPart = ({ offer }: { offer: OfferType }) => {
  return (
    <div className="offer-part">
      <h2>{offer.fileName}</h2>
      <div className="headings">
        <div>Name</div>
        <div>Description</div>
        <div>Failure rate (1/year)</div>
        <div>Quantity</div>
        <div>Price ($)</div>
      </div>
      <ProductPart data={offer.products}></ProductPart>
      <div className="total-cost">Total cost: ${offer.cost}</div>
    </div>
  );
}

export default OfferPart;