import { Body, Controller, Post, Get, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/users/schemas/user.schema';
import { UserEntity } from 'src/users/entities/user.entity';



@Controller('auth')
export class AuthController { 
   constructor( private authService: AuthService){}
    
   @Public()
   @Post('login')
   signIn (@Body()signInDto:SignInDto): Promise<{access_token: string}>{
  
    return this.authService.signIn(signInDto);

   }
   @Public()
   @Post('registration')
   signUp(@Body() singUpDto: SignUpDto): Promise<{access_token: string}> {
    return this.authService.signUp(singUpDto)
   }

   @Get('me')
   async me (@Req() req): Promise<UserEntity> {
    return req.user 
   }
   
 }
