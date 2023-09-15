import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type ProductDocument = HydratedDocument<Product>

@Schema()
export class Product {

  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  quantity: number;

  @Prop()
  weight: number;

  @Prop()
  sku: string | null;

  @Prop()
  price: number;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product)
ProductSchema.index({ name: 'text' });