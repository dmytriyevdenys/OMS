import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Sender } from "./sender.schema";

@Schema({
    timestamps: true,
    versionKey: false
})
export class SenderContact extends Document { 

    @Prop()
    Ref: string;

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

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Sender'})
    Sender: Sender

}

export const SenderContactSchema = SchemaFactory.createForClass(SenderContact)