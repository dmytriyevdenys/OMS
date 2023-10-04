import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Req,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { OrderAssociations } from 'src/orders/interfaces/order-associations.interfaces';
import { Document } from 'mongoose';
import { UserEntity } from './entities/user.entity';
import { Public } from 'src/decorators/public.decorator';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  async createUser(@Body() userDto: SignUpDto): Promise<UserEntity> {
    return this.userService.createUser(userDto);
  }

  @Put(':id')
 async updateUser(@Param('id') id: number,@Body() name: {name: string}) {
    return this.userService.updateUser(id,name);
  }

  @Get(':id')


  @Public()
  @Get()
  async getAll(): Promise<UserEntity[]> {
    return this.userService.getAllUsers();
  }

  @Delete()
  async removeUser(@Body() id: { id: string }) {
    return this.userService.removeUser(id);
  }

  @Get('manager')
  async getManager(@Query('id') id: string) {
    return this.userService.getManager(id);
  }

  @Post('manager')
  async setManager(
    @Body() dto: Extract<Document, User>,
    @Req() req,
  ){
    //return this.userService.setManager(dto, req.user);
  }

  @Post('source')
  async setSource(
    @Body() dto: Partial<OrderAssociations>,
    @Req() req,
  ) {
   // return this.userService.setSource(dto, req.user);
  }

 
}
