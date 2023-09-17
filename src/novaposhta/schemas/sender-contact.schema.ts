import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true,
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

}

export const SenderContactSchema = SchemaFactory.createForClass(SenderContact)