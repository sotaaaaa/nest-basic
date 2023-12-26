import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'accounts' })
export class AccountDocument extends Document {
  @Prop({ type: String, required: true, index: true })
  accountCode: string;

  @Prop({ type: String, required: true })
  accountName: string;

  @Prop({ type: String, required: true })
  accountPassword: string;

  @Prop({ type: String, index: true, unique: true })
  accountEmail?: string;

  @Prop({ type: String })
  accountPhone?: string;
}

export const AccountSchema = SchemaFactory.createForClass(AccountDocument);
