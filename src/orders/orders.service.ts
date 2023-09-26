import { Injectable, BadRequestException } from '@nestjs/common';
import { OrdersApiService } from './orders-api/orders-api.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { NewOrderDto } from './dto/order.dto';
import { BuyerService } from 'src/buyer/buyer.service';
import { BuyerDto } from 'src/buyer/dto/buyer.dto';
import { Buyer } from 'src/buyer/schemas/buyer.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    private ordersApiService: OrdersApiService,
    private buyerService: BuyerService,
    private userService: UsersService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async createOrder(dto: Partial<NewOrderDto>, req) {
    try {
      dto.user = req.user.id;
      const newBuyers = await Promise.all(
        dto.buyer.map(async (buyerData: BuyerDto) => {
          const newBuyer = await this.buyerService.createBuyer(buyerData);
          return newBuyer._id;
        }),
      );
      if (!newBuyers) {
        throw new BadRequestException('помилка блять');
      }
      dto.buyer = newBuyers;

      const newOrder = await this.orderModel.create(dto);
      if (!newOrder) {
        throw new BadRequestException(
          'сталась помилка при створенні замовлення',
        );
      }

      const user = await this.userService.findUserById(req.user.id);
      user.orders = newOrder.id;

      await user.save();
      await Promise.all(
        newBuyers.map(async (buyer) => {
          const newBuyer = await this.buyerService.findBuyerById(buyer);
          newBuyer.orders = newOrder.id;
          await newBuyer.save();
        }),
      );

      return newOrder;
    } catch (error) {
      throw new BadRequestException(
        'помилка при створенні замовлення',
        error.message,
      );
    }
  }

  async updateOrder() {}

  async getAllOrders() {
    const orders = await this.orderModel.find().exec();
    return orders;
  }

  async findOrderById() {}
}
