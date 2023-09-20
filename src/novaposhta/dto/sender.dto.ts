import { IsNotEmpty } from "class-validator";
import { SenderContact } from "../schemas/sender-contact.schema";
import { Address } from "../schemas/address.schema";


export class SenderInfo { 
    Ref: string;
    CounterpartyType: string;
    Description: string;
    Phones: string;
    Email: string;
    LastName: string;
    FirstName: string;
    MiddleName: string;
}

export class SenderContactDto {
    Description: string;
    Phones: string;
    Email: string;
    Ref: string;
    LastName: string;
    FirstName: string;
    MiddleName: string;

}

export class SenderDto extends SenderInfo {
    @IsNotEmpty()
    apiKey: string;
    id:string; 
    Contact: SenderContact;
    Address:Address
}