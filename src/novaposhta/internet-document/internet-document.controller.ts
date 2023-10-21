import { Body, Controller, Post } from '@nestjs/common';
import { InternetDocumentService } from './internet-document.service';
import { IntDocDto } from './dto/int-doc.dto';
import { ApiIntDocService } from './api-service/api-int-doc.service';

@Controller('internet-document')
export class InternetDocumentController {
    constructor(
        private intDocService: InternetDocumentService,
        private apiService: ApiIntDocService
    ){}

  @Post('create')
  async createIntDoc (@Body() dto: IntDocDto) {
   return await this.apiService.createIntDoc(dto);
  }  
}
