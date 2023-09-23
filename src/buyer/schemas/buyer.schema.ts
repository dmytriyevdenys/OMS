import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Order } from "src/orders/schemas/order.schema";

@Schema()
export class Buyer extends Document { 
    @Prop()
    full_name: string
    
    @Prop([String])
    phone: string[]

    @Prop()
    email: string

    @Prop({type: mongoose.Types.ObjectId, ref: 'Order'})
    order: Order

}

export const BuyerSchema = SchemaFactory.createForClass(Buyer);