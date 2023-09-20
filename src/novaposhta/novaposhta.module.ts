import { Module } from '@nestjs/common';
import { NovaposhtaController } from './novaposhta.controller';
import { NovaposhtaService } from './novaposhta.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sender, SenderSchema } from './schemas/sender.schema';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { HttpModule } from '@nestjs/axios';
import { ApiSenderService } from './novaposhta-api/novaposhta-api-sender.service';
import {
  SenderContact,
  SenderContactSchema,
} from './schemas/sender-contact.schema';
import { MatchModelService } from 'src/utils/match-model.service';
import { SenderService } from './novaposhta-sender.service';
import { ApiAddressService } from './novaposhta-api/novaposhta-api-address.service';
import { Address, AddressSchema } from './schemas/address.schema';
import { AddressService } from './noaposhta-address.service';
import { RecipientModule } from './recipient/recipient.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sender.name, schema: SenderSchema },
      { name: SenderContact.name, schema: SenderContactSchema },
      {name: Address.name, schema: AddressSchema}
    ]),
    HttpModule,

  ],
  controllers: [NovaposhtaController],
  providers: [
    NovaposhtaService,
    ApiNovaposhtaFetchService,
    ApiAddressService,
    ApiSenderService,
    MatchModelService,
    SenderService,
    AddressService
  ],
  exports:[MongooseModule]
})
export class NovaposhtaModule {}
