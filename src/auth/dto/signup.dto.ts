
import { IsNotEmpty, IsString } from "class-validator";
import { SignInDto } from "src/auth/dto/signin.dto";

export class SignUpDto extends SignInDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string; 

}