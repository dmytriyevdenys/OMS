import { Injectable, BadRequestException } from '@nestjs/common';
import { OrdersApiService } from './orders-api/orders-api.service';
import { OrderDto } from './dto/order.dto';
import { BuyerService } from 'src/buyer/buyer.service';
import { OrderEntity } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IntDocDto } from 'src/novaposhta/internet-document/dto/int-doc.dto';
import { InternetDocumentService } from 'src/novaposhta/internet-document/internet-document.service';
import { InternetDocumnetEntity } from 'src/novaposhta/internet-document/entities/internet-document.entity';
import { ApiIntDocService } from 'src/novaposhta/internet-document/api-service/api-int-doc.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { ResponseData } from 'src/interfaces/response-data.interface';
import { ResponseService } from 'src/utils/response.service';
import { OrderStatusEntity } from './entities/order-status.entity';
import { OrderCrm } from './interfaces/order-crm.interface';
import { PaymentEntity } from './entities/payments/payment.entity';
import { BuyerEntity } from 'src/buyer/entities/buyer.entity';
import { ProductsService } from 'src/products/products.service';
import { PaymentMethodEntity } from './entities/payments/payment-method.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersApiService: OrdersApiService,
    private readonly buyerService: BuyerService,
    private readonly entityManager: EntityManager,
    private readonly intDocService: InternetDocumentService,
    private readonly apiIntDocService: ApiIntDocService,
    private readonly responseService: ResponseService,
    private readonly productService: ProductsService,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderStatusEntity)
    private readonly statusRepository: Repository<OrderStatusEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
  ) {}

  async createOrder(
    dto: Partial<OrderDto>,
    user: UserEntity,
  ): Promise<ResponseData<OrderEntity>> {
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

      return this.responseService.successResponse(newOrder);
    } catch (error) {
      this.responseService.errorResponse(error.message);
    }
  }

  async updateOrder(orderId: number, dto: UpdateOrderDto) {
    try {
      const order = await this.findOrderById(orderId);
      const updateOrder = Object.assign(order, dto);
      await this.ordersApiService.updateOrder(order.orderCrm_id, dto);
      await this.entityManager.save(updateOrder);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async setOrderFromCrm(
    orderFromCrm: OrderCrm,
    user: UserEntity,
  ): Promise<OrderEntity> {
    const existingOrder = await this.getOrderByCrmId(orderFromCrm.id);
    if (!existingOrder) {
      const statusId = this.syncOrderStatus(orderFromCrm.status_id);
      const status = await this.statusRepository.findOneBy({ id: statusId });
      const additionalnformation = orderFromCrm.products
        .map((product) => product.name)
        .join(' ');
      const payment = await this.syncPaymentStatus(
        orderFromCrm.payments_total,
        orderFromCrm.grand_total,
      );
      const notes = orderFromCrm.custom_fields?.map((field) => field.value) || [
        '',
      ];
      const buyer = await this.syncBuyer(
        orderFromCrm.buyer || {
          full_name: orderFromCrm.shipping.recipient_full_name,
          phone: orderFromCrm.shipping.recipient_phone
        },
      );
      const products = await Promise.all(
        orderFromCrm.products.map(async (productFromCrm) => {
          const product = await this.productService.getProductBySku(
            productFromCrm.sku,
          );
          return product;
        }),
      );
      const orderMap: Partial<OrderEntity> = {
        orderCrm_id: orderFromCrm.id,
        status,
        additionalnformation,
        totalPrice: orderFromCrm.grand_total,
        payment,
        notes,
        user,
        buyer,
        products,
      };
      const order = new OrderEntity(orderMap);
      const newOrder = await this.entityManager.save(order);
      return newOrder;
    }
  }

  async getAllOrders(): Promise<ResponseData<OrderEntity[]>> {
    try {
      const orders = await this.orderRepository.find();
      if (!orders) throw new BadRequestException('Не інсує жодного замовлення');

      return this.responseService.successResponse(orders);
    } catch (error) {
      throw error;
    }
  }

  async getOrderByCrmId(id: string) {
    try {
      const order = await this.orderRepository.findOneBy({ orderCrm_id: id });
      if (!order) return null;
      return order;
    } catch (error) {
      throw error;
    }
  }

  async getStatuses() {
    try {
      const statuses = await this.statusRepository.find();
      if (!statuses) throw new BadRequestException('Не знайдено жодно статуса');
      return statuses;
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
          sender: true,
        },
      });
      return order;
    } catch (error) {
      throw error;
    }
  }

  async createIntDoc(orderId: number, dto: IntDocDto): Promise<OrderEntity> {
    try {
      const order = await this.findOrderById(orderId);
      const intDoc = await this.intDocService.createIntDoc(dto);
      order.sender = dto.sender;
      order.shipping = intDoc;
      await this.entityManager.save(order);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async addIntDoc(orderId: number, intDoc: string) {
    try {
      const order = await this.findOrderById(orderId);
      const newIntDoc = new InternetDocumnetEntity({
        IntDocNumber: intDoc,
      });
      order.shipping = newIntDoc;
      await this.entityManager.save(order);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async detachIntDoc(orderId: number) {
    try {
      const order = await this.findOrderById(orderId);
      await this.entityManager.remove(order.shipping);
      await this.entityManager.remove(order.sender);
      delete order.shipping;
      return order;
    } catch (error) {
      throw error;
    }
  }

  async removeIntDoc(orderId: number) {
    try {
      const order = await this.findOrderById(orderId);

      const refIntDoc = order.shipping.Ref;

      const removedIntDoc = await this.apiIntDocService.deleteIntDoc(
        order,
        refIntDoc,
      );
      if (removedIntDoc) {
        const updatedOrder = await this.detachIntDoc(orderId);
        return updatedOrder;
      }
    } catch (error) {
      throw error;
    }
  }

  private syncOrderStatus(statusId: string) {
    const statusMapping: Record<string, number> = {
      '1': 1,
      '3': 2,
      '4': 3,
      '5': 4,
      '6': 5,
      '21': 6,
      '20': 7,
      '12': 8,
      '19': 9,
      '8': 10,
      '22': 11,
    };
    return statusMapping[statusId];
  }

  private async syncPaymentStatus(paymentTotal: number, grandTotal: number) {
    try {
      if (paymentTotal === 0) {
        const paymentMethod = await this.paymentMethodRepository.findOneBy({
          name: 'CashOnDelivery',
        });
        const payment = new PaymentEntity(paymentMethod);
        payment.value = grandTotal;
        payment.payment_method_id = paymentMethod.id;
        const newPayment = await this.entityManager.save(payment);
        return newPayment;
      }
      if (paymentTotal > 0 && paymentTotal < grandTotal) {
        const paymentMethod = await this.paymentMethodRepository.findOneBy({
          name: 'Advance',
        });
        paymentMethod.value = paymentTotal;
        const payment = new PaymentEntity(paymentMethod);
        payment.payment_method_id = paymentMethod.id;
        const newPayment = await this.entityManager.save(payment);
        return newPayment;
      }

      if (paymentTotal === grandTotal) {
        const paymentMethod = await this.paymentMethodRepository.findOneBy({
          name: 'Card',
        });
        paymentMethod.value = paymentTotal;
        const payment = new PaymentEntity(paymentMethod);
        payment.payment_method_id = paymentMethod.id;
        const newPayment = await this.entityManager.save(payment);
        return newPayment;
      }
    } catch (error) {
      throw new BadRequestException('Платіж не знайденою', error.message);
    }
  }

  private async syncBuyer(buyerFromCrm: Partial<BuyerCrm>) {
    const buyer = await this.buyerService.validateBuyer([buyerFromCrm.phone]);
    if (buyer) return buyer;
    if (!buyer) {
      const buyer = new BuyerEntity({
        full_name: buyerFromCrm.full_name,
        phones: [buyerFromCrm.phone],
      });
      const newBuyer = await this.buyerService.createBuyer(buyer);
      return newBuyer;
    }
  }
}
