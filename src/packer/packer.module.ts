import { Module } from '@nestjs/common';
import { PackerController } from './packer.controller';
import { PackerService } from './packer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackerEntity } from './entities/packer.entity';
import { ResponseService } from 'src/utils/response.service';
import { ApiIntDocService } from 'src/novaposhta/internet-document/api-service/api-int-doc.service';
import { OrdersApiService } from 'src/orders/orders-api/orders-api.service';
import { OrdersModule } from 'src/orders/orders.module';
import { InternetDocumentModule } from 'src/novaposhta/internet-document/internet-document.module';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { ApiKeyService } from 'src/novaposhta/api-service/novaposhta-apikey.service';
import { RecipientApiService } from 'src/novaposhta/recipient/api-service/recipient-api.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { HttpModule } from '@nestjs/axios';
import { SenderService } from 'src/novaposhta/sender/sender.service';
import { MatchService } from 'src/utils/match-model.service';
import { SenderModule } from 'src/novaposhta/sender/sender.module';
import { RecipientModule } from 'src/novaposhta/recipient/recipient.module';
import { InternetDocumentService } from 'src/novaposhta/internet-document/internet-document.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PackerEntity]),
    OrdersModule,
    InternetDocumentModule,
    HttpModule,
    SenderModule,
    RecipientModule
  ],
  providers: [
    PackerService,
    ResponseService,
    ApiIntDocService,
    OrdersApiService,
    ApiNovaposhtaFetchService,
    ApiKeyService,
    RecipientApiService,
    ApiCrmFetchService,
    SenderService,
    MatchService,
    InternetDocumentService
  ],
  controllers: [PackerController],
  exports: [TypeOrmModule],
})
export class PackerModule {}
