import { Module, } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { OrdersApiService } from 'src/orders/orders-api/orders-api.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';



@Module({
  imports: [
  TypeOrmModule.forFeature([UserEntity, ProfileEntity]),
  HttpModule
  ],
  providers: [UsersService, OrdersApiService, ApiCrmFetchService],
  controllers: [UsersController],
  exports:[UsersService, TypeOrmModule]
})
export class UsersModule {}
