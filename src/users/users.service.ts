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
import { Order } from 'src/orders/schemas/order.schema';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private orderApiService: OrdersApiService,
    private readonly entityManager: EntityManager,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  async createUser(dto: SignUpDto): Promise<UserEntity> {

    try {
      const user = new UserEntity(dto);
      const newUser = await this.entityManager.save(user);
      if (!newUser) {
        throw new BadRequestException('помилка при реєстрації')
      }
      return newUser;
    }
    catch(error) {
      throw error;
    }
  }

  async updateUser(id: number, name: {name: string}) {
  try {
    const user = await this.usersRepository.findOneBy({id})
      if (!user) {
        throw new BadRequestException('не вдалось оновити користувача');
      }
    user.name = name.name ;
    await this.entityManager.save(user);
      return user;
  }  
  catch(error) {
    throw error
  }
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

  async getAllUsers(): Promise<UserEntity[]> {
   try { 
    const users = await this.usersRepository.find();
    if (!users) {
      throw new BadRequestException('Не вдалось завантажити користивачів')
    }
    return users 
   } catch (error) {
    throw error;
   }
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

  async assignOrderToUser (user : User, order: Order): Promise<User> {
   try {
    const updatedUser = await this.findUserById(user.id) ;
    updatedUser.orders = [...updatedUser.orders, order.id];
    await updatedUser.save();
    return updatedUser;
   }
   catch (error) {
    console.error ('Помилка при роботі з базою даних:', error);
    throw error;
   }
  }

}
