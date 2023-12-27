import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthResponse } from 'src/products/interfaces/auth-response.interface';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser(signInDto: SignInDto): Promise<UserEntity> {
    const { email, password } = signInDto;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Некоректний email');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Некоректний пароль');
    }
    return user;
  }

  async signUp(singUpDto: SignUpDto): Promise<AuthResponse> {
    const { password, email } = singUpDto;
  const user = await this.userService.findUserByEmail(email);

    if (user) {
      throw new BadRequestException('Користувач з таким email вже існує');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.createUser({
      ...singUpDto,
      password: hashedPassword,
    });
    return this.generateToken(newUser);
  }

  async signIn(signInDto: SignInDto): Promise<{access_token: string}> {
   try {
    const user = await this.validateUser(signInDto);
    return this.generateToken(user);
   } 
   catch (error) { 
    throw error
   }
  }

  private async generateToken(user: UserEntity): Promise<{access_token: string}> {
    const access_token = this.jwtService.sign({ id: user.id });

    return { access_token };
  }
}
