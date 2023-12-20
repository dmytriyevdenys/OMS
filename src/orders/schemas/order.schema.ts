import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Buyer } from "src/buyer/schemas/buyer.schema";
import { Sender } from "src/novaposhta/schemas/sender.schema";
import { Product } from "src/products/schemas/product.schema";
import { User } from "src/users/schemas/user.schema";

@Schema()
export class Order extends Document { 
    @Prop({type: mongoose.Schema.ObjectId, ref: Sender.name})
    sender: Sender;
    
    @Prop({type: mongoose.Schema.ObjectId, ref:'User'})
    user: User;

    @Prop()
    manager_id: string;

    @Prop()
    order_id: string;

    @Prop()
    status_id: string;

    @Prop()
    additionalnformation: string;

    @Prop()
    totalPrice: number;

    @Prop([{type: mongoose.Types.ObjectId, ref: 'Buyer'}])
    buyer: Buyer[];

    @Prop([String])
    notes: string[];

    @Prop ([])
    products: Product[]
}   

export const OrderSchema = SchemaFactory.createForClass(Order)