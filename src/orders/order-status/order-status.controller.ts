import { Controller, Get, Query, ValidationPipe, ParseArrayPipe } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { OrderStatusEntity } from './entities/order-status.entity';

@Controller('order/status')
export class OrderStatusController {
  constructor(private readonly statusService: OrderStatusService) {}

  @Get()
  async getStatus(
    @Query('id', new ParseArrayPipe({ items: Number, optional: true},), ValidationPipe) id?: number[],
  ): Promise<OrderStatusEntity[]> {     
      return await this.statusService.getAllStatuses(id);
    }
  }
