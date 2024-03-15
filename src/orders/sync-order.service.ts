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
import { OrdersApiService } from './orders-api/orders-api.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { OrderProductEntity } from 'src/products/entities/order-product.entity';
import { BuyerRecipientEntity } from 'src/buyer/entities/buyer-recipient.entity';


@Injectable()
export class SyncOrderService {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly entityManager: EntityManager,
    private readonly orderService: OrdersService,
    private readonly productService: ProductsService,
    private readonly apiService: ApiCrmFetchService,
    private readonly apiOrderService: OrdersApiService,
    @InjectRepository(PaymentMethodEntity)
    private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
    @InjectRepository(OrderStatusEntity)
    private readonly statusRepository: Repository<OrderStatusEntity>,
  ) {}

  async setOrderFromCrm(
    orderFromCrm: OrderCrm,
    user: UserEntity,
  ): Promise<OrderEntity> {
    try {
      const existingOrder = await this.orderService.getOrderByCrmId(
        orderFromCrm.id,
      );

      if (!existingOrder) {
        const statusId = this.syncOrderStatus(orderFromCrm.status_id);

        const status = await this.statusRepository.findOneBy({ id: statusId });
        const additionalnformation = this.cleanedString(
          orderFromCrm.products.map((product) => product.name).join(' '));
        const payment = await this.syncPaymentStatus(
          orderFromCrm.payments_total,
          orderFromCrm.grand_total,
        );
        const notes = orderFromCrm.custom_fields?.map((field) =>
          this.cleanedString(field.value || ''),
        ) || [''];
        const sycnShipping = await this.syncShipping(orderFromCrm.shipping);        
        const buyer = await this.syncBuyer(
          orderFromCrm.buyer || {
            full_name: orderFromCrm.shipping.recipient_full_name,
            phone: orderFromCrm.shipping.recipient_phone,
          },
        );        
        buyer.addresses = [];
        buyer.addresses.push(sycnShipping?.address);
        await this.entityManager.save(buyer);
      
        const products = await this.syncProducts(orderFromCrm.products);
        const orderMap: Partial<OrderEntity> = {
          orderCrm_id: orderFromCrm.id,
          status,
          additionalnformation,
          totalPrice: Math.floor(orderFromCrm.grand_total),
          payment,
          notes,
          buyer,
          user,
          products,
          shipping: { ...sycnShipping?.shipping, order_id: orderFromCrm.id },
        };
        const order = new OrderEntity(orderMap);
        console.log(order);

        const newOrder = await this.entityManager.save(order);

        if (!newOrder)
          throw new BadRequestException('помикла при збереженні замовлення');
        return newOrder;
      }
    } catch (error) {
      throw error;
    }
  }
  async importAllOrdersFromCrm(user: UserEntity) {
    try {
      await this.entityManager.transaction(async (queryRunner) => {
        let currentPage = 1;
        const delayBetweenRequests = 1300;
        let requestCount = 0;
        let lastPage = 1;

        async function delay(ms: number): Promise<void> {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }

        do {
          requestCount++;
          console.log(`Запит ${requestCount}: Виконано`);

          const data = await this.apiService.get(
            `${this.apiOrderService.urlOfOrder}`,
            {
              limit: 50,
              page: currentPage,
            },
          );

          await Promise.all(
            data.data.map(async (order: OrderCrm) => {
              const newOrder = await this.setOrderFromCrm(order, user);
              if (newOrder) {
                await queryRunner
                  .createQueryBuilder()
                  .insert()
                  .into(OrderEntity)
                  .values(newOrder)
                  .orIgnore(`("orderCrm_id") DO NOTHING`)
                  .execute();
                console.log(`Замовлення № ${order.id} записано`);
              }
            }),
          );
          lastPage = data.last_page;
          currentPage++;
          await delay(delayBetweenRequests);
        } while (currentPage <= 8);
      });
      return 'Успішно';
    } catch (error) {
      console.error('An error occurred in importAllOrdersFromCrm:', error);
      throw error;
    }
  }
  syncOrderStatus(statusId: string) {
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
      '28': 9,
    };
    return statusMapping[statusId];
  }

  async syncProducts(productsCrm: ProductCrm[]) {
    const products = await Promise.all(
      productsCrm.map(async (productFromCrm) => {
        if (productFromCrm.sku) {
          const product = await this.productService.getProductBySku(
            productFromCrm.sku,
          );
          if (product && product.quantity !== null) {
            product.quantity = product.quantity - productFromCrm.quantity;
          }
          const newProduct = new OrderProductEntity(product);
          newProduct.product = product;

          newProduct.quantity = productFromCrm.quantity;
          return newProduct;
        }
        if (!productFromCrm.sku) {
          const newProduct = new OrderProductEntity({
            name: productFromCrm.name,
            price: productFromCrm.price,
            quantity: productFromCrm.quantity,
            weight: productFromCrm.weight || null,
          });

          return newProduct;
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
        const payment = this.createPayment(paymentMethod, grandTotal);
        return payment;
      }
      if (paymentTotal > 0 && paymentTotal < grandTotal) {
        const paymentMethod = await this.paymentMethodRepository.findOneBy({
          name: 'Advance',
        });
        const payment = this.createPayment(paymentMethod, paymentTotal);
        return payment;
      }

      if (paymentTotal === grandTotal) {
        const paymentMethod = await this.paymentMethodRepository.findOneBy({
          name: 'Card',
        });
        const payment = this.createPayment(paymentMethod, grandTotal);
        return payment;
      }
    } catch (error) {
      throw new BadRequestException('Платіж не знайденою', error.message);
    }
  }

  private createPayment(
    paymentMethod: PaymentMethodEntity,
    paymentTotal: number,
  ) {
    const roundedTotal = (total: number) => Math.floor(total);
    paymentMethod.value = roundedTotal(paymentTotal);
    const paymnet = new PaymentEntity({
      name: paymentMethod.name,
      label: paymentMethod.label,
      payment_method_id: paymentMethod.id,
    });
    return paymnet;
  }

  private async syncBuyer(
    buyerFromCrm: Partial<BuyerCrm>,
  ) {
    // const buyer = await this.buyerService.validateBuyer([buyerFromCrm.phone]);
    // if (buyer) {
    //   if (buyer.full_name !== shippingCrm?.recipient_full_name) {
    //     const buyerRecipient = new BuyerRecipientEntity({
    //       full_name: shippingCrm.recipient_full_name,
    //       phones: [shippingCrm.recipient_phone],
    //     });
    //     buyer.recipients.push(buyerRecipient);
    //     return buyer;
    //   }
    //   return buyer;
    // }
    // if (!buyer) {
    //   const newBuyer = new BuyerEntity({
    //     full_name: buyerFromCrm.full_name,
    //     phones: [buyerFromCrm.phone],
    //     recipients: [],
    //   });
      
    //   if (newBuyer.full_name !== shippingCrm?.recipient_full_name) {
    //     const buyerRecipient = new BuyerRecipientEntity({
    //       full_name: shippingCrm.recipient_full_name,
    //       phones: [shippingCrm.recipient_phone],
    //     });
    //     newBuyer.recipients.push(buyerRecipient);
    //   }
    //   const createdBuyer = await this.buyerService.createBuyer(newBuyer);
    //   return createdBuyer;
    // }
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
    if (shippingCrm) {
      const regex = /№(\d+)/;
      const match = shippingCrm.full_address.match(regex);
      const address = new AddressEntity({
        Ref: shippingCrm.address_payload.warehouse_ref || '',
        CityDescription: shippingCrm.shipping_address_city,
        CityRef: shippingCrm.address_payload.city_ref || '',
        SettlementRef: '',
        SettlementDescription: '',
        Description: shippingCrm.full_address,
        Number: match ? Number(match[1]) : null,
      });
      const recipientFullName = shippingCrm?.recipient_full_name;

      const recipient = new RecipientEntity({
        FirstName: recipientFullName?.split(' ')[1] || '',
        LastName: recipientFullName?.split(' ')[0] || '',
        MiddleName: recipientFullName?.split(' ')[2] || '',
        Phone: shippingCrm?.recipient_phone || '',
      });

      const shipping = new InternetDocumnetEntity({
        Ref: shippingCrm.shipment_payload.uuid,
        IntDocNumber: shippingCrm.tracking_code,
        status: shippingCrm.shipping_status,
        recipient,
      });

      return { address, shipping };
    }
  }

  private cleanedString(string: string): string {
    const cleanedString = string.replace(/["'\\]+/g, '');
    return cleanedString;
  }
}
