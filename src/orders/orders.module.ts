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
import { BuyerService } from 'src/buyer/buyer.service';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ResponseService } from 'src/utils/response.service';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { MatchService } from 'src/utils/match-model.service';
import { PaymentEntity } from '../payments/entities/payment.entity';
import { OrderStatusEntity } from './order-status/entities/order-status.entity';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { PaymentMethodEntity } from '../payments/entities/payment-method.entity';
import { SyncOrderService } from './sync-order.service';
import { SourceEntity } from './entities/sources/source.entity';
import { OrderStatusModule } from './order-status/order-status.module';
import { OrderSourceModule } from './order-source/order-source.module';
import { InternetDocumentModule } from 'src/deliveries/novaposhta/internet-document/internet-document.module';
import { SenderModule } from 'src/deliveries/novaposhta/sender/sender.module';
import { InternetDocumentService } from 'src/deliveries/novaposhta/internet-document/internet-document.service';
import { SenderService } from 'src/deliveries/novaposhta/sender/sender.service';
import { ApiIntDocService } from 'src/deliveries/novaposhta/internet-document/api-service/api-int-doc.service';
import { RecipientApiService } from 'src/deliveries/novaposhta/recipient/api-service/recipient-api.service';
import { ApiKeyService } from 'src/deliveries/novaposhta/api-service/novaposhta-apikey.service';


@Module({
  imports: [

UsersModule,
  HttpModule,
    TypeOrmModule.forFeature([OrderEntity, PaymentEntity, OrderStatusEntity, PaymentMethodEntity, SourceEntity]),
    BuyerModule,
    InternetDocumentModule,
    SenderModule,
    ProductsModule,
    OrderStatusModule,
    OrderStatusModule,
    OrderSourceModule,
  ],
  controllers: [OrdersController, NewOrderWebHookController],
  providers: [
    OrdersService,
    SyncOrderService,
    ApiCrmFetchService,
    OrdersApiService,
    NewOrderWebHookService,
    BuyerService,
    UsersService,
    ResponseService,
    InternetDocumentService,
    SenderService,
    ApiIntDocService,
    ApiNovaposhtaFetchService,
    RecipientApiService,
    MatchService,
    ApiKeyService,
    SenderService,
    ProductsService,
  ],
  exports: []
})
export class OrdersModule {}
