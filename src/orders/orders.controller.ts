import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersApiService } from './orders-api/orders-api.service';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IntDocDto } from 'src/novaposhta/internet-document/dto/int-doc.dto';
import { OrderStatusCrm } from './interfaces/order-status-crm.intarface';

@Controller('order')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private ordersApiservice: OrdersApiService,
  ) {}
  @Get()
  async getAll() {
    return await this.ordersService.getAllOrders();
  }

  @Get('crm')
  async getAllFromCrm() {
    return await this.ordersApiservice.getAll();
  }
  @Post()
  async createOrder(@Body() dto: Partial<OrderDto>, @Req() req) {
    return this.ordersService.createOrder(dto, req.user);
  }

  @Post(':id/internet-document')
  async createIntDoc(@Param('id') id: number, @Body() dto: IntDocDto) {
    return await this.ordersService.createIntDoc(id, dto);
  }

  @Delete(':id/internet-document')
  async deletIntDoc(@Param('id') orderId: number) {
    return await this.ordersService.removeIntDoc(orderId);
  }

  @Post(':id/internet-document/add')
  async addIntDoc(
    @Param('id') id: number,
    @Body() IntDocNumber: { intDocNumber: string },
  ) {
    return await this.ordersService.addIntDoc(id, IntDocNumber.intDocNumber);
  }

  @Post(':id/internet-document/detach')
  async detach(@Param('id') id: number) {
    return await this.ordersService.detachIntDoc(id);
  }

  @Get(':id(\\d+)')
  async getOrderById(@Param('id') id: number) {
    return this.ordersService.findOrderById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateOrderDto) {
    return await this.ordersService.updateOrder(id, dto);
  }

  @Get('status')
  async getStatus(): Promise<OrderStatusCrm[]> {
    return this.ordersApiservice.getOrderStatus();
  }

  @Get('delivery-service')
  async getDeliveryService() {
    return this.ordersApiservice.getDeliveryService();
  }

  @Get('tag')
  async getTag() {
    return this.ordersApiservice.getTag();
  }
  @Get('source')
  async getSource() {
    return this.ordersApiservice.getSource();
  }

  @Get('fields')
  async getFields() {
    return this.ordersApiservice.getCustomField();
  }

  @Get('payment')
  async getPayment() {
    return this.ordersApiservice.getPayment();
  }

  @Post('crm')
  async createOrderCrm(@Body() dto: Partial<OrderDto>) {
    return this.ordersApiservice.createOrder(dto);
  }
}
