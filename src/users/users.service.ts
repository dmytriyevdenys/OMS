import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { OrdersApiService } from 'src/orders/orders-api/orders-api.service';
import { OrderAssociations } from 'src/orders/interfaces/order-associations.interfaces';
import { Order } from 'src/orders/schemas/order.schema';
import { EntityManager, RelationId, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerDto } from './dto/manager.dto';

@Injectable()
export class UsersService {
  constructor(
    private orderApiService: OrdersApiService,
    private readonly entityManager: EntityManager,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(dto: SignUpDto): Promise<UserEntity> {
    try {
      const user = new UserEntity(dto);
      const newUser = await this.entityManager.save(user);
      if (!newUser) {
        throw new BadRequestException('помилка при реєстрації');
      }
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, dto ) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new BadRequestException('не вдалось оновити користувача');
      }
      await this.entityManager.save(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async removeUser(id: number) {
    try {
      await this.usersRepository.delete(id);

      return 'Користувач видалений успішно';
    } catch (error) {
      throw new BadRequestException('Invalid request', error.message);
    }
  }

  async getAllUsers(): Promise<UserEntity[]> {
    try {
      const users = await this.usersRepository.find();
      if (!users) {
        throw new BadRequestException('Не вдалось завантажити користивачів');
      }
      return users;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.findOneBy({ email });
      if (!user) {
        throw new NotFoundException('Користувач не знайдений');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserById(id: number): Promise<UserEntity> {
    try { 
      const user = await this.usersRepository.findOne({
        where: {id: id},
        relations: {profile: true}
      });

      if(!user) { 
        throw new BadRequestException('Користувача не знайдено');
      }
      return user;
    }
    catch (error) { 
      throw error;
    }
    
  }

  async getManager(id: string){
    const manager = await this.orderApiService.getOrderById(id);
    const response = {
      manager_id: manager.manager.id,
      manager_name: manager.manager.full_name,
    };
    return response;
  }

  async setManager(dto: ManagerDto, userId: number) {
    try {
    
   /*   const user = await this.findUserById(userId);
      user.manager_id = dto.manager_id;
      user.manager_name = dto.manager_name;
     const updatedUser = await this.entityManager.save(user);
     if(!updatedUser) { 
      throw  new BadRequestException('Не вдалось оновити користувача');
     }
     return updatedUser;*/

    } catch (error) {
      throw error;
    }
  }

  async setSource(dto: Partial<OrderAssociations>, userId: number) {
    try {
    /*  const user = await this.findUserById(userId);
      user.source_id = dto.id;
      user.source_name = dto.name;
      const updatedUser = await this.entityManager.save(user);
      if (!updatedUser) {
        throw new BadRequestException('Не вдалось оновивити данні користувача');
      }
      return updatedUser;*/
    } catch (error) {
      throw error;
    }
  }

  async assignOrderToUser(user: User, order: Order) {
    try {
      /* const updatedUser = await this.findUserById(user.id) ;
    updatedUser.orders = [...updatedUser.orders, order.id];
    await updatedUser.save();
    return updatedUser;*/
    } catch (error) {
      console.error('Помилка при роботі з базою даних:', error);
      throw error;
    }
  }
}
