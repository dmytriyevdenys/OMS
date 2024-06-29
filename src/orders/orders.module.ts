import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { HttpModule } from '@nestjs/axios';
import { OrdersApiService } from './orders-api/orders-api.service';
import { NewOrderWebHookService } from './webhooks/new-order-webhook.service';
import { NewOrderWebHookController } from './webhooks/new-order-webhook.controller';
import { UsersModule } from 'src/users/users.module';
import { BuyerModule } from 'src/buyer/buyer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ResponseService } from 'src/utils/response.service';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { MatchService } from 'src/utils/match-model.service';
import { ProductsModule } from 'src/products/products.module';
import { SyncOrderService } from './sync-order.service';
import { SourceEntity } from './entities/sources/source.entity';
import { OrderStatusModule } from './order-status/order-status.module';
import { OrderSourceModule } from './order-source/order-source.module';
import { InternetDocumentModule } from 'src/deliveries/novaposhta/internet-document/internet-document.module';
import { PaymentsModule } from '../payments/payments.module';
import { SenderModule } from 'src/deliveries/novaposhta/sender/sender.module';



@Module({
  imports: [
    UsersModule,
    HttpModule,
    TypeOrmModule.forFeature([OrderEntity, SourceEntity]),
    BuyerModule,
    InternetDocumentModule,
    SenderModule,
    ProductsModule,
    OrderStatusModule,
    OrderStatusModule,
    OrderSourceModule,
    PaymentsModule,
  ],
  controllers: [OrdersController, NewOrderWebHookController],
  providers: [
    OrdersService,
    SyncOrderService,
    ApiCrmFetchService,
    OrdersApiService,
    NewOrderWebHookService,
    ResponseService,
    ApiNovaposhtaFetchService,
    MatchService,
  ],
  exports: [],
})
export class OrdersModule {}
