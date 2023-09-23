import { Body, Controller, Post, Get, Query, Req, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { OrderAssociations } from 'src/orders/interfaces/order-associations.interfaces';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  createUser(@Body() userDto: SignUpDto): Promise<UserDocument> {
    return this.userService.createUser(userDto);
  }
  
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Delete()
  async removeUser (@Body()id: {id: string}) {
    return this.userService.removeUser(id);
  }

  @Get('manager')
  async test(@Query('id') id: string) {
    return this.userService.getManager(id);
  }

  @Post('manager')
  async setManager(
    @Body() dto: Partial<OrderAssociations>,
    @Req() req,
  ): Promise<User> {
    return this.userService.setManager(dto, req.user);
  }

  @Post('source')
  async setSource(
    @Body() dto: Partial<OrderAssociations>,
    @Req() req,
  ): Promise<User> {
    return this.userService.setSource(dto, req.user);
  }
}
