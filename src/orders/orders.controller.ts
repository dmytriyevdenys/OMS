import { Controller, Get,Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersApiService } from './orders-api/orders-api.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('orders')
export class OrdersController {
    constructor (
        private ordersService: OrdersService,
        private ordersApiservice: OrdersApiService
        ) {}
    @Public()
    @Get()
    async getOrders () { 
        return this.ordersApiservice.getOrders()
    }

    @Public()
    @Get(':id')
    async getOrderById (@Param('id') id: string) {
        return this.ordersApiservice.getOrderById(id)
    }
}
