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
import { UserEntity } from './entities/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OrdersApiService } from 'src/orders/orders-api/orders-api.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private orderApiService: OrdersApiService,
  ) {}
  @Post()
  async createUser(@Body() userDto: SignUpDto): Promise<UserEntity> {
    return this.userService.createUser(userDto);
  }

  @Get()
  async getAll(): Promise<UserEntity[]> {
    return this.userService.getAllUsers();
  }

  @Get('manager')
  async getManager(@Query('id') id: string) {
    return this.userService.getManager(id);
  }

  @Get('source')
  async getSource() {
    return await this.orderApiService.getSource();
  }

  @Post('profile')
  async createProfile(
    @Body() dto: CreateProfileDto,
    @Req() req: Partial<UserEntity>,
  ) {
    return await this.userService.createProfile(dto, req.id);
  }

  @Put('profile')
  async updateProfile(@Body() dto: UpdateProfileDto, @Req() req) {
    return await this.userService.updateProfile(dto, req.id);
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<UserEntity> {
    return await this.userService.findUserById(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() name: { name: string }) {
    return this.userService.updateUser(id, name);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: number) {
    return this.userService.removeUser(id);
  }
}
