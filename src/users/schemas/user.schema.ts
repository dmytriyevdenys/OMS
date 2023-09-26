import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";
import { Order } from "src/orders/schemas/order.schema";
import { Product } from "src/products/schemas/product.schema";

export type UserDocument = HydratedDocument<User>

@Schema({
    timestamps: true, 
})

export class User extends Document {
    @Prop()
    userId: number

    @Prop()
    manager_id:number

    @Prop()
    manager_name: string

    @Prop()
    name: string 

    @Prop({unique: [true, 'Duplicate email entered']})
    email: string

    @Prop()
    password: string

    @Prop()
    source_id: number;
    
    @Prop()
    source_name: string

    @Prop([{type: mongoose.Schema.ObjectId, ref : Order.name}])
    orders: Order[]
}


export const  UserSchema = SchemaFactory.createForClass(User)