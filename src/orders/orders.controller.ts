import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  Put,
  Delete,
  Query,
  ParseArrayPipe,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersApiService } from './orders-api/orders-api.service';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { TTag } from './interfaces/tag-crm.type';
import { OrderCrm } from './interfaces/order-crm.interface';
import { SyncOrderService } from './sync-order.service';
import { IntDocDto } from 'src/deliveries/novaposhta/internet-document/dto/int-doc.dto';
import { PaymentsService } from 'src/payments/payments.service';
import { ResponseData } from 'src/interfaces/response-data.interface';
import { PaymentMethodEntity } from 'src/payments/entities/payment-method.entity';

@Controller('order')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly ordersApiservice: OrdersApiService,
    private readonly syncOrderService: SyncOrderService,
    private readonly paymentsService: PaymentsService
  ) {}

  @Get()
  async getOrderByStatuses (
    @Query('statuses', new ParseArrayPipe({ items: Number }), ValidationPipe) statuses: number[])
    {    
    return await this.ordersService.getOrderByStatuses(statuses);
  }

  @Get('all')
  async getAll() {
    return await this.ordersService.getAllOrders();
  }

  @Post('test') 
  async test (@Body () dto: OrderCrm, @Req () req) {
    return  await this.syncOrderService.setOrderFromCrm(dto, req.user)
  }

  @Post('testproduct')
  async testproduct(@Body () dto: ProductCrm[]) {
    return await this.syncOrderService.syncProducts(dto);
  }

  @Get('crm')
  async getAllFromCrm() {
    return await this.ordersApiservice.getAll();
  }

  @Get('import')
  async importAll (@Req() req) {
    return await this.syncOrderService.importAllOrdersFromCrm(req.user);
  }


  @Get('crm/:id')
  async getCrmOrderById (@Param('id') id: string) {
    return await this.ordersApiservice.getOrderById(id)
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

  @Get('delivery-service')
  async getDeliveryService() {
    return this.ordersApiservice.getDeliveryService();
  }

  @Get('tag')
  async getTag(): Promise<TTag[]>  {
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
  async getPaymentMethods(): Promise<ResponseData<PaymentMethodEntity[]>>{
    return await this.paymentsService.getPaymentMethods();
  }

  @Post('crm')
  async createOrderCrm(@Body() dto: Partial<OrderDto>) {
    return this.ordersApiservice.createOrder(dto);
  }
}
