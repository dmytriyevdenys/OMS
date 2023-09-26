import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { OrdersApiService } from 'src/orders/orders-api/orders-api.service';
import { OrderAssociations } from 'src/orders/interfaces/order-associations.interfaces';
import { MatchModelService } from 'src/utils/match-model.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private orderApiService: OrdersApiService,
  ) {}

  async createUser(dto: SignUpDto): Promise<UserDocument> {
    const user = await this.userModel.create(dto);
    return user;
  }

  async updateUser(dto: User) {
    const user = await this.findUserById(dto._id);
    const schemaPaths = this.userModel.schema.paths;

    return user;
  }

  async removeUser(id: { id: string }): Promise<User> {
    try {
      const userId = id.id;
      const user = await this.userModel.findByIdAndDelete(userId);
      if (!user) {
        throw new NotFoundException('Користувач не знайдений');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Invalid request', error.message);
    }
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();

    return users;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    try {
      const user = this.userModel.findOne({ email }).exec();
     if(!user) {
      throw new NotFoundException('Користувач не знайдений')
     }
      return user;
    } catch (error) {
      throw new BadRequestException('Сталась помилка при пошуку користувача');
    }
  }

  async findUserById(id: string | number): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    return user;
  }

  async getManager(id: string): Promise<Partial<User>> {
    const manager = await this.orderApiService.getOrderById(id);
    const response = {
      manager_id: manager.manager.id,
      manager_name: manager.manager.full_name,
    };
    return response;
  }

  async setManager(dto: User, user: User): Promise<User> {
    try {
      const userId = user.id;
      const updatedUser = await this.findUserById(userId);
      updatedUser.manager_id = dto.manager_id;
      updatedUser.manager_name = dto.manager_name;
      await updatedUser.save();
      return updatedUser;
    } catch (error) {
      throw new Error();
    }
  }

  async setSource(dto: Partial<OrderAssociations>, user: User): Promise<User> {
    try {
      const userId = user.id;
      const updatedUser = await this.findUserById(userId);
      updatedUser.source_id = dto.id;
      updatedUser.source_name = dto.name;
      await updatedUser.save();
      return updatedUser;
    } catch (error) {
      throw new Error();
    }
  }


}
