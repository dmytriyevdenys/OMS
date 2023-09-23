import { Controller, Get,Param, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersApiService } from './orders-api/orders-api.service';
import { Public } from 'src/decorators/public.decorator';
import { OrderDto } from './dto/order.dto';

@Controller('order')
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

    @Get('payment') 
    async getPayment () {
        return this.ordersApiservice.getPayment();
    }

    @Post() 
    async createOrder (@Body() dto:Partial< OrderDto>) {
        return this.ordersApiservice.createOrder(dto)
    }
}
