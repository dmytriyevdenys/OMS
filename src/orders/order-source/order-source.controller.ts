import { Controller, Get } from '@nestjs/common';
import { OrderSourceService } from './order-source.service';
import { SourceEntity } from './entities/source.entity';
import { ResponseData } from 'src/interfaces/response-data.interface';

@Controller()
export class OrderSourceController {
  constructor(private readonly sourceService: OrderSourceService) {}

  @Get()
  async getSources(): Promise<ResponseData<SourceEntity[]>>{
    return await this.sourceService.getAllSources();
  }
}
