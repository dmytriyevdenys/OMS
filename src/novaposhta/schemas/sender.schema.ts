import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


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
  Phones: number;

  @Prop()
  Email: string;

  @Prop()
  LastName: string;

  @Prop()
  FirstName: string;

  @Prop()
  MiddleName: string;
}

export const SenderSchema = SchemaFactory.createForClass(Sender);
