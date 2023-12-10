  export type Offer = {
    fileName: string,
    fileData: object
  }

  export type OfferProps = {
    offers: Offer[],
    setOffers: (a: Offer[]) => void
  }