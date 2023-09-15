import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema({
    timestamps: true
})

export class User {
    @Prop()
    userId: number

    @Prop()
    name: string 

    @Prop({unique: [true, 'Duplicate email entered']})
    email: string

    @Prop()
    password: string
     
}


export const  UserSchema = SchemaFactory.createForClass(User)