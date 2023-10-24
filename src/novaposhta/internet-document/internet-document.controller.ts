import { Body, Controller, Get, Post } from '@nestjs/common';
import { InternetDocumentService } from './internet-document.service';
import { IntDocDto } from './dto/int-doc.dto';
import { ApiIntDocService } from './api-service/api-int-doc.service';

@Controller('internet-document')
export class InternetDocumentController {
    constructor(
        private intDocService: InternetDocumentService,
        private apiService: ApiIntDocService
    ){}

    @Get()
    async getAll () { 
      return await this.intDocService.getAll(); 
    }

  @Post('create')
  async createIntDoc (@Body() dto: IntDocDto) {
   return await this.intDocService.createIntDoc(dto);
  }  
}
