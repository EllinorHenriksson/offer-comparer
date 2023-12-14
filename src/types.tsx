export type Offer = {
  fileName: string,
  parts: ProductPart[],
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

export type OfferProps = {
  offers: Offer[],
  setOffers: (a: Offer[]) => void
}

