import { MinLength, IsNotEmpty } from "class-validator";

export class CreatePackerDto { 
    @IsNotEmpty()
    name: string; 
    @MinLength(6)
    password: string
}