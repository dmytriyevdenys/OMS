import { Module } from '@nestjs/common';
import { NovaposhtaController } from './novaposhta.controller';
import { NovaposhtaService } from './novaposhta.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sender, SenderSchema } from './schemas/sender.schema';
import { ApiNovaposhtaFetchService } from 'src/utils/api-novaposhta-fetch.service';
import { HttpModule } from '@nestjs/axios';
import { ApiSenderService } from './novaposhta-api/novaposhta-api-sender.service';

@Module({
  imports:[

  MongooseModule.forFeature([{name: Sender.name, schema: SenderSchema}]),
  HttpModule
  ],
  controllers: [NovaposhtaController],
  providers: [NovaposhtaService, ApiNovaposhtaFetchService, ApiSenderService]
})
export class NovaposhtaModule {}
