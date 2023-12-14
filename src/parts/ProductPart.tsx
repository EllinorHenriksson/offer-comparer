import { ProductPartWithChildren } from "../types";

const ProductPart = ({ data }: { data: ProductPartWithChildren[] }) => {
  return (
    <div className="product-part">
      {data.map(parent => {
        return (
          <div key={parent.productPart.name} className="parent-container">
            <div className="parent-data">
              <div className="parent-name">{parent.productPart.name}</div>
              <div className="description">{parent.productPart.description}</div>
              <div className="parent-failure-rate">{parent.productPart.failureRate}</div>
              <div className="parent-quantity">{parent.productPart.quantity}</div>
              <div className="parent-price">{parent.productPart.price}</div>
            </div>
            <div className="children-container">
              {parent.children && <ProductPart data={parent.children} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductPart;