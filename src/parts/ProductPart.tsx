import { ProductPartWithChildren } from "../types";

/**
 * Represents a product part.
 * 
 * @param data The data of the offer (i.e. the product parts)
 * @param padding The padding to apply to the name div to visually represent the nesting
 */
const ProductPart = ({ data, padding }: { data: ProductPartWithChildren[], padding: number }) => {
  return (
    <div className="product-part">
      {data.map(parent => {
        return (
          <div key={parent.productPart.name} className="parent-container">
            <div className="parent-data grid-container">
              <div className="parent-name" style={{paddingLeft: `${padding}px`}}>
                {parent.productPart.name && parent.productPart.name}
                {!parent.productPart.name && '-'}
                </div>
              <div>
                {parent.productPart.description && parent.productPart.description}
                {!parent.productPart.description && '-'}
                </div>
              <div>
                {parent.productPart.failureRate && parent.productPart.failureRate}
                {!parent.productPart.failureRate && '-'}
                </div>
              <div>
                {parent.productPart.quantity && parent.productPart.quantity}
                {!parent.productPart.quantity && '-'}
                </div>
              <div>
                {parent.productPart.price && parent.productPart.price}
                {!parent.productPart.price && '-'}
                </div>
            </div>
            <div className="children-container">
              {parent.children.length > 0 && <ProductPart data={parent.children} padding={padding + 20} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductPart;