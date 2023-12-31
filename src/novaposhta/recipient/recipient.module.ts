import { Module } from '@nestjs/common';
import { RecipientService } from './recipient.service';
import { RecipientController } from './recipient.controller';
import { MatchService } from 'src/utils/match-model.service';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { SenderService } from '../sender/sender.service';
import { HttpModule } from '@nestjs/axios';
import { SenderModule } from '../sender/sender.module';
import { AddressModule } from '../address/address.module';
import { ApiKeyService } from '../api-service/novaposhta-apikey.service';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipientEntity } from './entities/recipient.entity';
import { RecipientApiService } from './api-service/recipient-api.service';


@Module({
  imports: [HttpModule, SenderModule, AddressModule, TypeOrmModule.forFeature([RecipientEntity])],
  controllers: [RecipientController],
  providers: [
    RecipientService,
    MatchService,
    ApiNovaposhtaFetchService,
    SenderService,
    ApiKeyService,
    RecipientApiService
      ],
  exports: [RecipientModule],
})
export class RecipientModule {}
