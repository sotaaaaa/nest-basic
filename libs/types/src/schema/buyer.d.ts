export interface BuyerInterface {
  buyerCode: string;
  storeCode: string;
  buyerFirstName: string;
  buyerLastName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerBirthDate: Date;
  buyerGender: BuyerGenders;
  isReceivePromotionalEmail: boolean;
  deliveryAddress: string;
  deliveryPhone: string;
  deliveryProvinceCode: string;
  deliveryDistrictCode: string;
  deliveryWardCode: string;
  additionalNote: string;
  buyerTagCodes: string[];
  status: BuyerStatus;
}
