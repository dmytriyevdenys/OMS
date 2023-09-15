import { Body, Controller, Post, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Public } from 'src/decorators/public.decorator';



@Controller('auth')
export class AuthController { 
   constructor( private authService: AuthService){}
    
   @Public()
   @Post('/login')
   signIn (@Body()signInDto:SignInDto){
   return this.authService.signIn(signInDto) ;

   }
   @Public()
   @Post('/registration')
   signUp(@Body() singUpDto: SignUpDto): Promise<{access_token: string}> {
    return this.authService.signUp(singUpDto)
   }
   
 }
