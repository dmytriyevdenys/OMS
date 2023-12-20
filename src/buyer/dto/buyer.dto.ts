import { IsEmail, IsOptional, IsString,  } from "class-validator";

export class BuyerDto {
    @IsString()
    full_name: string;
    phones?: string[];
  
    @IsOptional()
    @IsEmail()
    email: string;
  }

  