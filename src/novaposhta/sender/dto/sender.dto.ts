import { IsNotEmpty } from "class-validator";
import { ContractPersonEntity } from "../entities/contact-person.entity";

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
    Contact: ContractPersonEntity
}