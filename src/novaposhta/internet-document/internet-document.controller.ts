import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { InternetDocumentService } from './internet-document.service';
import { IntDocDto } from './dto/int-doc.dto';
import { ApiIntDocService } from './api-service/api-int-doc.service';
import { Public } from 'src/decorators/public.decorator';
import { DEV_ROUTE } from 'src/consts/routes';

@Controller('internet-document')
export class InternetDocumentController {
  constructor(
    private intDocService: InternetDocumentService,
    private apiService: ApiIntDocService,
  ) {}

  @Public()
  @Get()
  async getIntDocs(
    @Query('packerId') packerId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    
    if (packerId)
      return this.intDocService.paginateByPackerId(packerId, {
        page,
        limit,
        route: `${DEV_ROUTE}internet-document?packerId=${packerId}`,
      });
    return await this.intDocService.getAll({
      page,
      limit,
      route: `${DEV_ROUTE}internet-document`,
    });
  }

  @Post()
  async createIntDoc(@Body() dto: IntDocDto) {
    return await this.intDocService.createIntDoc(dto);
  }

  @Put(':id')
  async updateIntDoc(@Param('id') id: number, @Body() dto: IntDocDto) {
    return await this.intDocService.updateIntDoc(dto, id);
  }
  @Post('price')
  async getPrice(@Body() dto: IntDocDto) {
    return await this.apiService.getDeliveryPrice(dto);
  }

  @Get('tracking/:number')
  async getTrackingDocument(@Param('number') intDocNumber: string) {
    return await this.apiService.getStatusDocument(intDocNumber);
  }
}
