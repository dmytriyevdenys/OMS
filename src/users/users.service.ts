import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { OrdersApiService } from 'src/orders/orders-api/orders-api.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private orderApiService: OrdersApiService
    
  ) {}

  async createUser(dto: SignUpDto): Promise<UserDocument> {
    const user = await this.userModel.create(dto);
    return user;
  }

  async getAllUsers(): Promise<UserDocument[]> {
    const users = await this.userModel.find().exec();

    return users;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user = this.userModel.findOne({ email }).exec();

    return user;
  }

  async findUserById(id: string | number): Promise<UserDocument> {
    const user= await this.userModel.findById(id)
    return user
  }

  async setManager(id: string ) {
    const manager = await this.orderApiService.getOrderById(id);
    const response = { 
      id: manager.manager.id,
      name: manager.manager.full_name
    }
    return response;
  }


}
