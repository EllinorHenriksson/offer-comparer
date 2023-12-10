  export type Offer = {
    fileName: string,
    fileData: any,
  }

  export type OfferProps = {
    offers: Offer[],
    setOffers: (a: Offer[]) => void
  }