import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
   // @IsEmail({}, {message: 'будь ласка введдіть коректний email'})
    readonly email: string;
    @IsNotEmpty()
    @IsString()
    readonly password: string;
}