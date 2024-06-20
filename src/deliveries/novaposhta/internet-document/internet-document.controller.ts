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
  Sse,
  Res,
} from '@nestjs/common';
import { InternetDocumentService } from './internet-document.service';
import { IntDocDto } from './dto/int-doc.dto';
import { ApiIntDocService } from './api-service/api-int-doc.service';
import { DEV_ROUTE } from 'src/consts/routes';
import { Observable } from 'rxjs';
import { InternetDocumentSubscriber } from './internet-document.subscriber';
import { MessageEvent } from './interfaces/message-event.interface';
import { FindIntDocDto } from './dto/find-int-doc.dto';

@Controller('internet-document')
export class InternetDocumentController {
  constructor(
    private intDocService: InternetDocumentService,
    private apiService: ApiIntDocService,
    private intDocSubscriber: InternetDocumentSubscriber
  ) {}

  @Get()
  async getIntDocs(
    @Query('packerId') packerId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query() query: FindIntDocDto
  ) {
    limit = limit > 100 ? 100 : limit;
    
    if (packerId && !query.search.length)
      return this.intDocService.paginateByPackerId(packerId, {
        page,
        limit,
        route: `${DEV_ROUTE}internet-document?packerId=${packerId}`,
      });
    return await this.intDocService.getAll({
      page,
      limit,
      route: `${DEV_ROUTE}internet-document`,
    }, query);
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

  @Sse('sse')
  sse(@Res() res): Observable<MessageEvent> {
    return new Observable(() => {
      const dataSubscription = this.intDocSubscriber.get().subscribe((data) => {
        if (data !== null) {
          const eventData = `data: ${JSON.stringify(data)}\n\n`;
          res.write(eventData);
        }
      });

      return () => {
        dataSubscription.unsubscribe();
      };
    });
  }

}
