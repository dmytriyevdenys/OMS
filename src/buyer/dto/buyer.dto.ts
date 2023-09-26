import {  IsEmail, IsOptional } from "class-validator";

export class BuyerDto {
    
    @IsOptional()
    id?: string;

    full_name: string;
    phone: string[];
    @IsOptional()
    @IsEmail()
    email: string;

}