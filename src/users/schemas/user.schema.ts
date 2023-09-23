import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

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
    managerName: string

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
}


export const  UserSchema = SchemaFactory.createForClass(User)