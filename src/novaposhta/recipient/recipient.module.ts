import { Module } from '@nestjs/common';
import { RecipientService } from './recipient.service';
import { RecipientController } from './recipient.controller';
import { MatchModelService } from 'src/utils/match-model.service';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { SenderService } from '../novaposhta-sender.service';
import { HttpModule } from '@nestjs/axios';
import { AddressService } from '../noaposhta-address.service';
import { NovaposhtaModule } from '../novaposhta.module';


@Module({
  imports: [HttpModule, NovaposhtaModule],
  controllers: [RecipientController],
  providers: [
    RecipientService,
    MatchModelService,
    ApiNovaposhtaFetchService,
    SenderService,
    AddressService
  ],
  exports: [RecipientModule],
})
export class RecipientModule {}
