import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerService } from 'src/buyer/buyer.service';
import { EntityManager, Repository } from 'typeorm';
import { PaymentMethodEntity } from './entities/payments/payment-method.entity';
import { PaymentEntity } from './entities/payments/payment.entity';
import { BuyerEntity } from 'src/buyer/entities/buyer.entity';
import { OrdersService } from './orders.service';
import { OrderCrm } from './interfaces/order-crm.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderStatusEntity } from './entities/order-status.entity';
import { ProductsService } from 'src/products/products.service';
import { TShippingCrm } from './interfaces/shipping-crm.type';
import { AddressEntity } from 'src/novaposhta/address/entities/address.entity';
import { InternetDocumnetEntity } from 'src/novaposhta/internet-document/entities/internet-document.entity';
import { RecipientEntity } from 'src/novaposhta/recipient/entities/recipient.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Injectable()
export class SyncOderService {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly entityManager: EntityManager,
    private readonly orderService: OrdersService,
    private readonly productService: ProductsService,
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
    @InjectRepository(OrderStatusEntity)
    private readonly statusRepository: Repository<OrderStatusEntity>,
  ) {}

  async setOrderFromCrm(
    orderFromCrm: OrderCrm,
    user: UserEntity,
  ): Promise<OrderEntity> {
    const existingOrder = await this.orderService.getOrderByCrmId(
      orderFromCrm.id,
    );

    if (!existingOrder) {
      const statusId = this.syncOrderStatus(orderFromCrm.status_id);
      const status = await this.statusRepository.findOneBy({ id: statusId });
      const additionalnformation = this.cleanedString(
        orderFromCrm.products.map((product) => product.name).join(' '),
      );
      const payment = await this.syncPaymentStatus(
        orderFromCrm.payments_total,
        orderFromCrm.grand_total,
      );
      const notes = orderFromCrm.custom_fields?.map((field) => this.cleanedString(field.value)) || [
        '',
      ];
      const { address, shipping } = await this.syncShipping(
        orderFromCrm.shipping,
      );
      const buyer = await this.syncBuyer(
        orderFromCrm.buyer || {
          full_name: orderFromCrm.shipping.recipient_full_name,
          phone: orderFromCrm.shipping.recipient_phone,
        },
      );
      buyer.address = address;

      const products = await this.syncProducts(orderFromCrm.products);
      const orderMap: Partial<OrderEntity> = {
        orderCrm_id: orderFromCrm.id,
        status,
        additionalnformation,
        totalPrice: orderFromCrm.grand_total,
        payment,
        notes,
        buyer,
        products,
        shipping: { ...shipping, order_id: orderFromCrm.id },
      };
      const order = new OrderEntity(orderMap);
      order.user = user;
      const newOrder = await this.entityManager.save(order);
      return newOrder;
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

  private async syncProducts(productsCrm: ProductCrm[]) {
    const products = await Promise.all(
      productsCrm.map(async (productFromCrm) => {
        if (productFromCrm.sku) {
          const product = await this.productService.getProductBySku(
            productFromCrm.sku,
          );
          return product;
        }
        if (!productFromCrm.sku) {
          const product = new ProductEntity(productFromCrm);
          const productName = this.cleanedString(product.name)
          product.name = productName;
          return product;
        }
      }),
    );
    return products;
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

  private async syncShipping(shippingCrm: TShippingCrm) {
    const regex = /№(\d+)/;
    const match = shippingCrm.full_address.match(regex);
    const address = new AddressEntity({
      Ref: shippingCrm.address_payload.warehouse_ref || '',
      CityDescription: shippingCrm.shipping_address_city,
      CityRef: shippingCrm.address_payload.city_ref || '',
      SettlementRef: '',
      SettlementDescription: '',
      Description: shippingCrm.full_address,
      Number: match ? Number(match[0]) : null,
    });

    const recipient = new RecipientEntity({
      FirstName: shippingCrm.recipient_full_name.split(' ')[1],
      LastName: shippingCrm.recipient_full_name.split(' ')[0],
      MiddleName: shippingCrm.recipient_full_name.split(' ')[2] || '',
      Phone: shippingCrm.recipient_phone || '',
    });

    const shipping = new InternetDocumnetEntity({
      Ref: shippingCrm.shipment_payload.uuid,
      IntDocNumber: shippingCrm.tracking_code,
      status: shippingCrm.shipping_status,
      recipient,
    });

    return { address, shipping };
  }

  private cleanedString(string: string): string {
    const cleanedString = string.replace(/["'\\]+/g, '');
    return cleanedString;
  }
}
