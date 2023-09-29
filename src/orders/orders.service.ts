import { Injectable, BadRequestException } from '@nestjs/common';
import { OrdersApiService } from './orders-api/orders-api.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { OrderDto } from './dto/order.dto';
import { BuyerService } from 'src/buyer/buyer.service';
import { UsersService } from 'src/users/users.service';
import { error } from 'console';

@Injectable()
export class OrdersService {
  constructor(
    private ordersApiService: OrdersApiService,
    private buyerService: BuyerService,
    private userService: UsersService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async createOrder(dto: Partial<OrderDto>, req): Promise<Order> {
    try {
      const newOrder = await this.newOrder(dto, req);
      if (!newOrder) {
        throw new BadRequestException('помилка при створенні замовлення');
      }
      const newOrderCrm = await this.ordersApiService.createOrder(dto);
      newOrder.order_id = newOrderCrm.id;
      newOrder.status_id = newOrderCrm.status_id;
      await newOrder.save();
      return newOrder;
    } catch (error) {
      throw new BadRequestException(
        'помилка при створенні замовлення',
        error.message,
      );
    }
  }

  async newOrder(dto: Partial<OrderDto>, req): Promise<Order> {
    try {
      const newBuyers = await this.buyerService.createBuyer(dto.buyer);

      dto.user = req.user.id;

      const newOrder = await this.orderModel.create(dto);
      if (!newOrder) {
        throw new BadRequestException(
          'сталась помилка при створенні замовлення',
        );
      }
      const updateBuyers = await this.buyerService.assignOrderToBuyers(
        newBuyers,
        newOrder,
      );
      await this.userService.assignOrderToUser(req.user, newOrder);

      newOrder.buyer = updateBuyers.map((buyer) => buyer.id);
      await newOrder.save();
      return newOrder;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateOrder(dto: OrderDto, req) {
    try {
      if (!dto.id) {
        throw new BadRequestException(`Поле id обов'язкове`)
      }
      const order = await this.findOrderById(dto.id);
      
    } 
    catch(error) {
      throw error;
    }
  }

  async getAllOrders() {
    const orders = await this.orderModel.find().exec();
    return orders;
  }

  async findOrderById(id: string) {
    try {
      const order = await this.orderModel.findById(id);
      if (!order) {
        throw new BadRequestException('сталась помилка при пошуку замовлення');
      }
      return order ;
    }
    catch(error) {
      throw error
    }
  }
}
