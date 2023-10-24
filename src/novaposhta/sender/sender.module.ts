import { Module } from '@nestjs/common';
import { SenderController } from './sender.controller';
import { SenderService } from './sender.service';
import { ApiKeyService } from '../api-service/novaposhta-apikey.service';
import { HttpModule } from '@nestjs/axios';
import { ApiSenderService } from './api-service/novaposhta-api-sender.service';
import { MatchService } from 'src/utils/match-model.service';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SenderEntity } from './entities/sender.entity';
import { ContractPersonEntity } from './entities/contact-person.entity';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SenderEntity, ContractPersonEntity]),
    HttpModule,
  ],
  controllers: [SenderController],
  providers: [
    SenderService,
    ApiSenderService,
    MatchService,
    ApiNovaposhtaFetchService,
  ],
  exports: [TypeOrmModule, SenderModule]
})
export class SenderModule {}
