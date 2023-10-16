import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { OrdersApiService } from 'src/orders/orders-api/orders-api.service';
import { OrderAssociations } from 'src/orders/interfaces/order-associations.interfaces';
import { Order } from 'src/orders/schemas/order.schema';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerDto } from './dto/manager.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileEntity } from './entities/profile.entity';
import { log } from 'console';
import { UpdateProdileDto } from './dto/update-profile.dto';

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

  async createProfile (dto: Partial<CreateProfileDto>, id: number): Promise<UserEntity> { 
    try {
      
     const user = await this.findUserById(id);
     const profile = new ProfileEntity({
      phone: dto.phone
     });    
     user.profile = profile;
     await this.entityManager.save(user);
     return user
    }   
    catch(error) { 
     throw error;
    }
   }

   async updateProfile (dto: UpdateProdileDto, id: number) {
      const user = await this.findUserById(id);
      console.log(user);
      
      Object.assign(user.profile, dto); 
      await this.entityManager.save(user);
      return user;

   }

  
}
