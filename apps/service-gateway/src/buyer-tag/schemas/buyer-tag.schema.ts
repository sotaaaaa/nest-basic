import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'buyer-tags' })
export class BuyerTagDocument extends Document {
  @Prop({ required: true, type: String, index: true })
  storeCode: string;

  @Prop({ required: true, type: String, index: true, unique: true })
  buyerTagCode: string;

  @Prop({ required: true, type: String })
  buyerTagName: string;

  @Prop({ type: String })
  buyerTagDescription?: string;

  @Prop({ required: true, type: String })
  buyerTagColor: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const BuyerTagSchema = SchemaFactory.createForClass(BuyerTagDocument);
