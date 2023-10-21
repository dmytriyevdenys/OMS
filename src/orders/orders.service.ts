import { Injectable, BadRequestException } from '@nestjs/common';
import { OrdersApiService } from './orders-api/orders-api.service';
import { OrderDto } from './dto/order.dto';
import { BuyerService } from 'src/buyer/buyer.service';
import { OrderEntity } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IntDocDto } from 'src/novaposhta/internet-document/dto/int-doc.dto';

@Injectable()
export class OrdersService {
  constructor(
    private ordersApiService: OrdersApiService,
    private buyerService: BuyerService,
    private readonly entityManager: EntityManager,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async createOrder(dto: Partial<OrderDto>, user) {
    try {
      const order = new OrderEntity(dto);
      order.user = user;
      if (dto.buyer && !dto.buyer.id) {
        const buyer = await this.buyerService.createBuyer(dto.buyer);
        order.buyer = buyer;
      }
      const crmOrder = await this.ordersApiService.createOrder(dto);
        order.orderCrm_id = crmOrder.id;
      const newOrder = await this.entityManager.save(order);
      if (!newOrder)
        throw new BadRequestException('Не вдалось створити замовлення');
      
      return newOrder;
    } catch (error) {
      throw new BadRequestException(
        'помилка при створенні замовлення',
        error.message,
      );
    }
  }

  async updateOrder(orderId: number, dto: UpdateOrderDto) {
    try {
      const order = await this.findOrderById(orderId);
     const updateOrder =  Object.assign(order, dto);
     await this.ordersApiService.updateOrder(order.orderCrm_id, dto);
      await this.entityManager.save(updateOrder);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.orderRepository.find();
      if (!orders) throw new BadRequestException('Не інсує жодного замовлення');

      return orders;
    } catch (error) {
      throw error;
    }
  }

  async findOrderById(id: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: {
          user: true,
          products: true,
          buyer: true,
        },
      });
      return order;
    } catch (error) {
      throw error;
    }
  }

  async createIntDoc (orderId: number, dto: IntDocDto) {
    
  }

}
