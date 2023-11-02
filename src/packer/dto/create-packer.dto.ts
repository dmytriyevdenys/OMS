import { MinLength } from "class-validator";

export class CreatePackerDto { 
    name: string; 
    @MinLength(6)
    password: string
}