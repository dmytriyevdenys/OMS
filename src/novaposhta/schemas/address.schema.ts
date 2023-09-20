import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Address extends Document {
  @Prop()
  CityDescription: string;

  @Prop()
  CityRef: string;

  @Prop()
  SettlementRef: string;

  @Prop()
  SettlementDescription: string;

  @Prop()
  Description: string;

  @Prop()
  Ref: string;

  @Prop()
  Number: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
