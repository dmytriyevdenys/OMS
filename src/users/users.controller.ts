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
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { OrderAssociations } from 'src/orders/interfaces/order-associations.interfaces';
import { UserEntity } from './entities/user.entity';
import { ManagerDto } from './dto/manager.dto';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post()
  async createUser(@Body() userDto: SignUpDto): Promise<UserEntity> {
    return this.userService.createUser(userDto);
  }


  @Get()
  async getAll(): Promise<UserEntity[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getById (@Param('id') id: number): Promise<UserEntity>{
    return await this.userService.findUserById(id);
  }

  @Put(':id')
 async updateUser(@Param('id') id: number,@Body() name: {name: string}) {
    return this.userService.updateUser(id,name);
  }
 
  @Delete(':id')
  async removeUser(@Param('id') id: number) {
    return this.userService.removeUser(id);
  }

  @Get('manager')
  async getManager(@Query('id') id: string){
    //return this.userService.getManager(id);
  }

  @Post('manager')
  async setManager(
    @Body() dto: ManagerDto,
    @Req() req,
  ){
    return this.userService.setManager(dto, req.user.id);
  }

  @Post('source')
  async setSource(
    @Body() dto: Partial<OrderAssociations>,
    @Req() req,
  ) {
   return this.userService.setSource(dto, req.user.id);
  }

 
}
