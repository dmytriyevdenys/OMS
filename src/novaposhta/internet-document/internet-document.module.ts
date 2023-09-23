import { Module } from '@nestjs/common';
import { InternetDocumentController } from './internet-document.controller';
import { InternetDocumentService } from './internet-document.service';

@Module({
  controllers: [InternetDocumentController],
  providers: [InternetDocumentService]
})
export class InternetDocumentModule {}
