import { Module } from '@nestjs/common';
import { NovaposhtaController } from './novaposhta.controller';
import { InternetDocumentModule } from './internet-document/internet-document.module';
import { RecipientModule } from './recipient/recipient.module';
import { SenderModule } from './sender/sender.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    InternetDocumentModule,
    RecipientModule,
    SenderModule,
    AddressModule,
  ],
  controllers: [NovaposhtaController],
  providers: [],
  exports: [],
})
export class NovaposhtaModule {}
