
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UserEntity } from 'src/users/entities/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    }); 
  }

  async validate (payload: {id: number}):Promise<UserEntity> { 
    const { id } = payload

    const user = await this.userService.findUserById(id); 

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint')
    }

    return user;
  }

}