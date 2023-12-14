export type OfferType = {
  fileName: string,
  products: ProductPartWithChildren[],
  cost: number
}

export type ProductPart = {
  name: string,
  type: string,
  quantity: number,
  price: number | null,
  failureRate: number,
  description: string,
  parent: string
}

export type ProductPartWithChildren = {
  productPart: ProductPart,
  children: ProductPartWithChildren[]
}

export type OfferProps = {
  offers: OfferType[],
  setOffers: (a: OfferType[]) => void
}

