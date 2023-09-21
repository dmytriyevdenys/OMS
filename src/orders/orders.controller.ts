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
    @Get(':id(\\d+)')
    async getOrderById (@Param('id') id: string) {
        return this.ordersApiservice.getOrderById(id)
    }

    @Get('status')
    async getStatus () {
        return this.ordersApiservice.getOrderStatus();
    }

    @Get('delivery-service')
    async getDeliveryService () {
        return this.ordersApiservice.getDeliveryService();
    }

    @Get('tag')
    async getTag () {
        return this.ordersApiservice.getTag();
    }

    @Get('source')
    async getSource () {
        return this.ordersApiservice.getSource();
    }

    @Get('fields')
    async getFields () {
        return this.ordersApiservice.getCustomField();
    }
}
