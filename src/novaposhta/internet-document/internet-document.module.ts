import { Module } from '@nestjs/common';
import { InternetDocumentController } from './internet-document.controller';
import { InternetDocumentService } from './internet-document.service';
import { SenderModule } from '../sender/sender.module';
import { SenderService } from '../sender/sender.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternetDocumnetEntity } from './entities/internet-document.entity';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { HttpModule } from '@nestjs/axios'; // Оновлено імпорт
import { ApiIntDocService } from './api-service/api-int-doc.service';

@Module({
  imports: [
    SenderModule,
    TypeOrmModule.forFeature([InternetDocumnetEntity]),
    HttpModule, // Оновлено імпорт
  ],
  controllers: [InternetDocumentController],
  providers: [
    InternetDocumentService,
    SenderService,
    ApiNovaposhtaFetchService,
    ApiIntDocService,
  ],
  exports: [InternetDocumentModule],
})
export class InternetDocumentModule {}
