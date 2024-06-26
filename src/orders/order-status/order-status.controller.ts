import { Controller, Get, Query, ValidationPipe, ParseArrayPipe } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { OrderStatusEntity } from './entities/order-status.entity';

@Controller('order/status')
export class OrderStatusController {
  constructor(private readonly statusService: OrderStatusService) {}

  @Get()
  async getStatus(
    @Query('id', new ParseArrayPipe({ items: Number }), ValidationPipe) id: number[],
    @Query('all', ValidationPipe) all: boolean,
  ): Promise<OrderStatusEntity[]>{
    if (all) return this.statusService.getAllStatuses();
    return this.statusService.getStatusesForOrderBoard(id);
  }
}
