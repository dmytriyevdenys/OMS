import { Module } from '@nestjs/common';
import { NovaposhtaController } from './novaposhta.controller';
import { NovaposhtaService } from './novaposhta.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { HttpModule } from '@nestjs/axios';
import { MatchService } from 'src/utils/match-model.service';
import { SenderService } from './sender/sender.service';
import { ApiAddressService } from './novaposhta-api/novaposhta-api-address.service';
import { SenderModule } from './sender/sender.module';
import { AddressModule } from './address/address.module';


@Module({
  imports: [

  ], 
  controllers: [NovaposhtaController],
  providers: [
  ],
  exports:[]
})
export class NovaposhtaModule {}
