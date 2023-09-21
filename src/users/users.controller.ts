import { Body, Controller, Post, Get,  Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  createUser(@Body() userDto: SignUpDto): Promise<UserDocument> {
    return this.userService.createUser(userDto);
  }
  @Public()
  @Get()
  getAll():Promise<UserDocument[]>{
    return this.userService.getAllUsers()
  }

  @Get('manager')
  async test (@Query('id') id: string) {
    return this.userService.setManager(id);
  }
}
