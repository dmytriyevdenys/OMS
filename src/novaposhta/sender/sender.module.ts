import { Module } from '@nestjs/common';
import { SenderController } from './sender.controller';
import { SenderService } from './sender.service';
import { ApiAddressService } from '../novaposhta-api/novaposhta-api-address.service';
import { ApiKeyService } from '../novaposhta-apikey.service';
import { Sender, SenderSchema } from '../schemas/sender.schema';
import {
  SenderContact,
  SenderContactSchema,
} from '../schemas/sender-contact.schema';
import { Address, AddressSchema } from '../schemas/address.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ApiSenderService } from '../novaposhta-api/novaposhta-api-sender.service';
import { AddressService } from '../noaposhta-address.service';
import { MatchService } from 'src/utils/match-model.service';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SenderEntity } from './entities/sender.entity';
import { ContractPersonEntity } from './entities/contact-person.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sender.name, schema: SenderSchema },
      { name: SenderContact.name, schema: SenderContactSchema },
      { name: Address.name, schema: AddressSchema },
    ]),
    TypeOrmModule.forFeature([SenderEntity, ContractPersonEntity]),
    HttpModule,
  ],
  controllers: [SenderController],
  providers: [
    SenderService,
    ApiAddressService,
    ApiKeyService,
    ApiSenderService,
    AddressService,
    MatchService,
    ApiNovaposhtaFetchService,
  ],
  exports: [MongooseModule,TypeOrmModule]
})
export class SenderModule {}
