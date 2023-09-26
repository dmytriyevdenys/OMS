import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { HttpModule } from '@nestjs/axios';
import { OrdersApiService } from 'src/orders/orders-api/orders-api.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';



@Module({
  imports: [

  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  
  HttpModule
  ],
  providers: [UsersService, OrdersApiService, ApiCrmFetchService],
  controllers: [UsersController],
  exports:[MongooseModule,UsersService]
})
export class UsersModule {}
