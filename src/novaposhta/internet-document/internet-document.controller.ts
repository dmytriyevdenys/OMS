import { Body, Controller, Get, Post, Put, Param } from '@nestjs/common';
import { InternetDocumentService } from './internet-document.service';
import { IntDocDto } from './dto/int-doc.dto';
import { ApiIntDocService } from './api-service/api-int-doc.service';

@Controller('internet-document')
export class InternetDocumentController {
  constructor(
    private intDocService: InternetDocumentService,
    private apiService: ApiIntDocService,
  ) {}

  @Get()
  async getAll() {
    return await this.intDocService.getAll();
  }

  @Post()
  async createIntDoc(@Body() dto: IntDocDto) {
    return await this.intDocService.createIntDoc(dto);
  }

  @Put(":id")
  async updateIntDoc (@Param('id') id: number, @Body() dto: IntDocDto) {
    return await this.intDocService.updateIntDoc(dto, id);
  }
  @Post('price')
  async getPrice(@Body() dto: IntDocDto) {
    return await this.apiService.getDeliveryPrice(dto);
  }
  
  @Get('tracking/:number')
  async getTrackingDocument (@Param('number') intDocNumber: string) { 
    return await this.apiService.getStatusDocument(intDocNumber);
  }
}
