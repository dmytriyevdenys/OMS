import { IsMobilePhone, IsEmail, IsOptional } from "class-validator";

export class BuyerDto {
    id: string;
    full_name: string;
    phone: string[];
    @IsOptional()
    @IsEmail()
    email: string;

}