import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { HttpModule } from '@nestjs/axios';
import { OrdersApiService } from './orders-api/orders-api.service';
import { NewOrderWebHookService } from './webhooks/new-order-webhook.service';
import { NewOrderWebHookController } from './webhooks/new-order-webhook.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { UsersModule } from 'src/users/users.module';
import { BuyerModule } from 'src/buyer/buyer.module';
import { BuyerService } from 'src/buyer/buyer.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ResponseService } from 'src/utils/response.service';


@Module({
  imports: [

UsersModule,
  HttpModule,
    MongooseModule.forFeature([{name: Order.name, schema: OrderSchema}
    ]),
    TypeOrmModule.forFeature([OrderEntity]),
    BuyerModule
  ],
  controllers: [OrdersController, NewOrderWebHookController],
  providers: [
    OrdersService,
    ApiCrmFetchService,
    OrdersApiService,
    NewOrderWebHookService,
    BuyerService,
    UsersService,
    ResponseService
  ],
  exports: []
})
export class OrdersModule {}
