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
import { InternetDocumentService } from 'src/novaposhta/internet-document/internet-document.service';
import { InternetDocumentModule } from 'src/novaposhta/internet-document/internet-document.module';
import { SenderService } from 'src/novaposhta/sender/sender.service';
import { SenderModule } from 'src/novaposhta/sender/sender.module';
import { ApiIntDocService } from 'src/novaposhta/internet-document/api-service/api-int-doc.service';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { RecipientApiService } from 'src/novaposhta/recipient/api-service/recipient-api.service';
import { MatchService } from 'src/utils/match-model.service';
import { ApiKeyService } from 'src/novaposhta/api-service/novaposhta-apikey.service';
import { PaymentEntity } from './entities/payments/payment.entity';
import { OrderStatusEntity } from './entities/order-status.entity';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { ProductsApiService } from 'src/products/products-api/products-api.service';
import { PaymentMethodEntity } from './entities/payments/payment-method.entity';
import { SyncOderService } from './sync-order.service';


@Module({
  imports: [

UsersModule,
  HttpModule,
    TypeOrmModule.forFeature([OrderEntity, PaymentEntity, OrderStatusEntity, PaymentMethodEntity]),
    BuyerModule,
    InternetDocumentModule,
    SenderModule,
    ProductsModule,
  ],
  controllers: [OrdersController, NewOrderWebHookController],
  providers: [
    OrdersService,
    SyncOderService,
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
