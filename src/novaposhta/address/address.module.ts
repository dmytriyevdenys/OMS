import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressEntity } from './entities/address.entity';
import { ApiAddressService } from '../novaposhta-api/novaposhta-api-address.service';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { SenderService } from '../sender/sender.service';
import { MatchService } from 'src/utils/match-model.service';
import { NovaposhtaModule } from '../novaposhta.module';
import { HttpModule } from '@nestjs/axios';
import { SenderModule } from '../sender/sender.module';
import { ApiKeyService } from '../novaposhta-apikey.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddressEntity]),
    HttpModule,
    SenderModule
  ],

  controllers: [AddressController],
  providers: [
    AddressService,
    ApiAddressService,
    ApiNovaposhtaFetchService,
    MatchService,
    ApiKeyService,
    SenderService
  ],
  exports: [TypeOrmModule, AddressModule],
})
export class AddressModule {}
