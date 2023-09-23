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

@Module({
  imports: [
    forwardRef(() => UsersModule),
  HttpModule,
    MongooseModule.forFeature([{name: Order.name, schema: OrderSchema}])
  ],
  controllers: [OrdersController, NewOrderWebHookController],
  providers: [
    OrdersService,
    ApiCrmFetchService,
    OrdersApiService,
    NewOrderWebHookService,
  ],
  exports: []
})
export class OrdersModule {}
