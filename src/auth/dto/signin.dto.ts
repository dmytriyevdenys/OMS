import { IsNotEmpty, IsString, } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    readonly email: string;
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}