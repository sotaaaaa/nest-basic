import { BuyerGenders, BuyerStatus } from './../types/buyer.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'buyers' })
export class BuyerDocument extends Document {
  @Prop({ required: true, type: String, index: true, unique: true })
  buyerCode: string;

  @Prop({ required: true, type: String, index: true })
  storeCode: string;

  @Prop({ required: true, type: String })
  buyerFirstName: string;

  @Prop({ required: true, type: String })
  buyerLastName: string;

  @Prop({ required: true, type: String })
  buyerName: string;

  @Prop({ type: String })
  buyerEmail?: string;

  @Prop({ type: String })
  buyerPhone?: string;

  @Prop({ type: Date })
  buyerBirthDate?: Date;

  @Prop({ type: String, enum: BuyerGenders })
  buyerGender?: BuyerGenders;

  // Nhận email quảng cáo hay không
  @Prop({ type: Boolean, default: false })
  isReceivePromotionalEmail?: boolean;

  // Quản lý địa chỉ giao hàng
  @Prop({ type: String })
  deliveryAddress?: string;

  @Prop({ type: String })
  deliveryPhone?: string;

  @Prop({ type: String })
  deliveryProvinceCode?: string;

  @Prop({ type: String })
  deliveryDistrictCode?: string;

  @Prop({ type: String })
  deliveryWardCode?: string;

  // Thông tin thêm
  @Prop({ type: String })
  additionalNote?: string;

  @Prop({ type: [String], default: [] })
  buyerTagCodes: string[];

  // Status
  @Prop({ type: String, enum: BuyerStatus, default: BuyerStatus.ACTIVE })
  status: BuyerStatus;
}

export const BuyerSchema = SchemaFactory.createForClass(BuyerDocument);

export interface buyerInterface {
    buyerCode: string;
    storeCode: string;
    buyerFirstName: string;
    buyerLastName: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerBirthDate: Date;
    buyerGender: import("/Users/sota/Workspaces/boilerplate/nest-backend/apps/service-account/src/buyer/types/buyer.enum").BuyerGenders;
    isReceivePromotionalEmail: boolean;
    deliveryAddress: string;
    deliveryPhone: string;
    deliveryProvinceCode: string;
    deliveryDistrictCode: string;
    deliveryWardCode: string;
    additionalNote: string;
    buyerTagCodes: string[];
    status: import("/Users/sota/Workspaces/boilerplate/nest-backend/apps/service-account/src/buyer/types/buyer.enum").BuyerStatus;
}

export interface buyerInterface {
    buyerCode: string;
    storeCode: string;
    buyerFirstName: string;
    buyerLastName: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerBirthDate: Date;
    buyerGender: import("/Users/sota/Workspaces/boilerplate/nest-backend/apps/service-account/src/buyer/types/buyer.enum").BuyerGenders;
    isReceivePromotionalEmail: boolean;
    deliveryAddress: string;
    deliveryPhone: string;
    deliveryProvinceCode: string;
    deliveryDistrictCode: string;
    deliveryWardCode: string;
    additionalNote: string;
    buyerTagCodes: string[];
    status: import("/Users/sota/Workspaces/boilerplate/nest-backend/apps/service-account/src/buyer/types/buyer.enum").BuyerStatus;
}
