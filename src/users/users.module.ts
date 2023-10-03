import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { OrdersApiService } from 'src/orders/orders-api/orders-api.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';



@Module({
  imports: [
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  TypeOrmModule.forFeature([UserEntity]),
  HttpModule
  ],
  providers: [UsersService, OrdersApiService, ApiCrmFetchService],
  controllers: [UsersController],
  exports:[MongooseModule,UsersService, TypeOrmModule]
})
export class UsersModule {}
