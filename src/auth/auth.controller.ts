import { Body, Controller, Post, Get, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Public } from 'src/decorators/public.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { IsString } from 'class-validator';



@Controller('auth')
export class AuthController { 
   constructor( private authService: AuthService){} 
    
   @Public()
   @Post('login')
   async signIn (@Body()signInDto:SignInDto): Promise<{access_token: string}>{
  
    return await this.authService.signIn(signInDto);

   }
   @Public() 
   @Post('registration')
   signUp(@Body() singUpDto: SignUpDto): Promise<{access_token: string}> {
    return this.authService.signUp(singUpDto)
   }
   
   @Post('refresh')
   async refreshToken (@Body() access_token: string): Promise<{access_token: string}>{
      return await this.authService.refreshToken(access_token)
   }
   @Get('me')
   async me (@Req() req): Promise<UserEntity> {
    return req.user 
   }
   
 }
