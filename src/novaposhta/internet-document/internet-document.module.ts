import { Module } from '@nestjs/common';
import { InternetDocumentController } from './internet-document.controller';
import { InternetDocumentService } from './internet-document.service';
import { SenderModule } from '../sender/sender.module';
import { SenderService } from '../sender/sender.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternetDocumnetEntity } from './entities/internet-document.entity';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { HttpModule } from '@nestjs/axios'; 
import { ApiIntDocService } from './api-service/api-int-doc.service';
import { RecipientService } from '../recipient/recipient.service';
import { MatchService } from 'src/utils/match-model.service';
import { ApiKeyService } from '../api-service/novaposhta-apikey.service';
import { RecipientApiService } from '../recipient/api-service/recipient-api.service';

@Module({
  imports: [
    SenderModule,
    TypeOrmModule.forFeature([InternetDocumnetEntity]),
    HttpModule, 
  ],
  controllers: [InternetDocumentController],
  providers: [
    InternetDocumentService,
    SenderService,
    ApiNovaposhtaFetchService,
    ApiIntDocService,
    RecipientService,
    ApiKeyService,
    MatchService,
    RecipientApiService
  ],
  exports: [TypeOrmModule, InternetDocumentModule],
})
export class InternetDocumentModule {}
