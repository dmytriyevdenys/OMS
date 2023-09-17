import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SenderContact, } from './sender-contact.schema';


@Schema({
  timestamps: true,
})
export class Sender extends Document {
  @Prop({ unique: [true, 'api ключ вже існує'] })
  apiKey: string;

  @Prop()
  Ref: string;

  @Prop()
  CounterpartyType: string;

  @Prop()
  Description: string;

  @Prop()
  Phones: string;

  @Prop()
  Email: string;

  @Prop()
  LastName: string;

  @Prop()
  FirstName: string;

  @Prop()
  MiddleName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: SenderContact.name})
  Contact: SenderContact;

  @Prop({ type: mongoose.Schema.Types.Boolean, default: false })
  isDefault: boolean;
}

export const SenderSchema = SchemaFactory.createForClass(Sender);
