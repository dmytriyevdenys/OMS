import { Injectable, BadRequestException } from '@nestjs/common';
import { OrdersApiService } from './orders-api/orders-api.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { OrderDto } from './dto/order.dto';
import { BuyerService } from 'src/buyer/buyer.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    private ordersApiService: OrdersApiService,
    private buyerService: BuyerService,
    private userService: UsersService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async createOrder(dto: Partial<OrderDto>, req) {
    try {
      const newOrder = await this.newOrder(dto, req);
      if (!newOrder) {
        throw new BadRequestException('помилка при створенні замовлення');
      }
      //   const newOrderCrm: OrderCrm = await this.ordersApiService.createOrder(dto);

      //  newOrder.order_id = newOrderCrm.id;
      //  newOrder.status_id = newOrderCrm.status_id;
      //  await newOrder.save()

      const orderResponse = await this.findOrderById(newOrder.id);
      return orderResponse;
    } catch (error) {
      throw new BadRequestException(
        'помилка при створенні замовлення',
        error.message,
      );
    }
  }

  async newOrder(dto: Partial<OrderDto>, req): Promise<Order> {
    try {
      dto.user = req.user.id;
      const newOrder = await this.orderModel.create(dto);
      if (!newOrder) {
        throw new BadRequestException(
          'сталась помилка при створенні замовлення',
        );
      }
      await newOrder.save();
      return newOrder;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }



  async updateOrder(orderId: string, dto: OrderDto, req): Promise<Order> {
    try {
      if (!orderId) {
        throw new BadRequestException(`Поле id обов'язкове`);
      }
      const updateOrder = await this.orderModel.findByIdAndUpdate(
        { _id: orderId },
        dto,
        { new: true },
      );
      await updateOrder.save();
      return updateOrder;
    } catch (error) {
      throw error;
    }
  }

  async getAllOrders() {
    const orders = await this.orderModel.find().exec();
    return orders;
  }

  async findOrderById(id: string) {
    try {
      const order = await this.orderModel
        .findById(id)
        .populate({
          path: 'buyer',
          model: 'Buyer',
          select: '-orders',
        })
        .populate({
          path: 'user',
          select: '-orders',
        })
        .exec();
      if (!order) {
        throw new BadRequestException('сталась помилка при пошуку замовлення');
      }
      return order;
    } catch (error) {
      throw error;
    }
  }
}
