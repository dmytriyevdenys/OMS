import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { HttpModule } from '@nestjs/axios';
import { OrdersApiService } from './orders-api/orders-api.service';
import { NewOrderWebHookService } from './new-order-webhook.service';
import { NewOrderWebHookController } from './new-order-webhook.controller';

@Module({
  imports:[HttpModule],
  controllers: [OrdersController, NewOrderWebHookController],
  providers: [OrdersService,ApiCrmFetchService,OrdersApiService, NewOrderWebHookService]
})
export class OrdersModule {}
