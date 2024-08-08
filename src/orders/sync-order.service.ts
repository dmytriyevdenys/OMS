import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerService } from 'src/buyer/buyer.service';
import { EntityManager, Repository } from 'typeorm';
import { PaymentMethodEntity } from '../payments/entities/payment-method.entity';
import { PaymentEntity } from '../payments/entities/payment.entity';
import { BuyerEntity } from 'src/buyer/entities/buyer.entity';
import { OrdersService } from './orders.service';
import { OrderCrm } from './interfaces/order-crm.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderStatusEntity } from './order-status/entities/order-status.entity';
import { ProductsService } from 'src/products/products.service';
import { TShippingCrm } from './interfaces/shipping-crm.type';
import { OrdersApiService } from './orders-api/orders-api.service';
import { ApiCrmFetchService } from 'src/utils/api-crm-fetch.service';
import { OrderProductEntity } from 'src/products/entities/order-product.entity';
import { BuyerRecipientEntity } from 'src/buyer/entities/buyer-recipient.entity';
import { AddressEntity } from 'src/deliveries/novaposhta/address/entities/address.entity';
import { RecipientEntity } from 'src/deliveries/novaposhta/recipient/entities/recipient.entity';
import { InternetDocumnetEntity } from 'src/deliveries/novaposhta/internet-document/entities/internet-document.entity';
import { OrderAssociations } from './interfaces/order-associations.interfaces';


@Injectable()
export class SyncOrderService {
  private sourcesCache:OrderAssociations[];

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
  ) {
    
  }

  async setOrderFromCrm(
    orderFromCrm: OrderCrm,
    user: UserEntity,
  ): Promise<OrderEntity> {
    try {
     await this.fetchAndCacheOrderSources();
      const existingOrder = await this.orderService.getOrderByCrmId(
        orderFromCrm.id,
      );

      if (!existingOrder) {
        const statusId = this.syncOrderStatus(orderFromCrm.status_id);

        const status = await this.statusRepository.findOneBy({ id: statusId });
        const source = this.syncOrderSource(Number(orderFromCrm.id))
        const additionalnformation = orderFromCrm.products
          .map((product) => {
            const comment = product.comment ? product.comment : '';
            const info = `${product.name} ${comment}`;
            return info;
          })
          .join(' ');
        const payment = await this.syncPaymentStatus(
          orderFromCrm.payments_total,
          orderFromCrm.grand_total,
        );

        const notes = [
          (
            orderFromCrm.custom_fields?.map((field) => field.value) || ['']
          ).join(' '),
        ];

        const sycnShipping = await this.syncShipping(orderFromCrm?.shipping);
        const buyer = await this.syncBuyer(
          orderFromCrm.buyer || {
            full_name: orderFromCrm.shipping.recipient_full_name,
            phone: orderFromCrm.shipping.recipient_phone,
          },
          orderFromCrm.shipping,
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
        const newOrder = await this.entityManager.save(order);
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
          try {
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
                try {
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
                } catch (error) {
                  console.error(
                    `Помилка запису замовлення № ${order.id}:`,
                    error,
                  );
                }
              }),
            );

            lastPage = data.last_page;
            currentPage++;

            await delay(delayBetweenRequests);
          } catch (error) {
            console.error(`Помилка запиту на сторінці ${currentPage}:`, error);
          }
        } while (currentPage <= lastPage && currentPage <= 8);
      });
      return 'Успішно';
    } catch (error) {
      console.error('An error occurred in importAllOrdersFromCrm:', error);
      throw error;
    }
  }

  async syncOrderSource (sourceId: number) {
    const currentSource = this.sourcesCache.find(source => source.id === sourceId);
    return currentSource;
  } 
  private async fetchAndCacheOrderSources () {
    const sources = await this.apiOrderService.getSource();
    sources.forEach(source => this.sourcesCache[source.id] = source)
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
    const createProduct = async (productCrm: ProductCrm) => {
      const newProduct = new OrderProductEntity({
        name: productCrm.name,
        price: productCrm.price,
        quantity: productCrm.quantity,
        weight: productCrm.weight || null,
        comment: productCrm.comment || null,
      });
      await this.entityManager.save(newProduct);
      return newProduct;
    };

    const products = await Promise.all(
      productsCrm.map(async (productFromCrm) => {
        if (productFromCrm.sku) {
          const product = await this.productService.getProductBySku(
            productFromCrm.sku,
          );
          if (product && product.quantity !== null) {
            product.quantity = product.quantity - productFromCrm.quantity;
            const newProduct = new OrderProductEntity(product);
            newProduct.product = product;
            newProduct.quantity = productFromCrm.quantity;
            newProduct.comment = productFromCrm.comment || null;
            await this.entityManager.save(newProduct);

            return newProduct;
          }
          return await createProduct(productFromCrm);
        }
        if (!productFromCrm.sku) {
          return await createProduct(productFromCrm);
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
        const payment = await this.createPayment(paymentMethod, grandTotal);
        return payment;
      }
      if (paymentTotal > 0 && paymentTotal < grandTotal) {
        const paymentMethod = await this.paymentMethodRepository.findOneBy({
          name: 'Advance',
        });
        const payment = await this.createPayment(paymentMethod, paymentTotal);
        return payment;
      }

      if (paymentTotal === grandTotal) {
        const paymentMethod = await this.paymentMethodRepository.findOneBy({
          name: 'Card',
        });
        const payment = await this.createPayment(paymentMethod, grandTotal);
        return payment;
      }
    } catch (error) {
      throw new BadRequestException('Платіж не знайденою', error.message);
    }
  }

  private async createPayment(
    paymentMethod: PaymentMethodEntity,
    paymentTotal: number,
  ) {
    const roundedTotal = (total: number) => Math.floor(total);
    const value = roundedTotal(paymentTotal);
    const paymnet = new PaymentEntity({
      name: paymentMethod.name,
      label: paymentMethod.label,
      payment_method_id: paymentMethod.id,
      value
    });
    await this.entityManager.save(paymnet);
    return paymnet;
  }

  private async syncBuyer(
    buyerFromCrm: Partial<BuyerCrm>,
    shippingCrm: TShippingCrm,
  ) {
    try {
      const buyer = await this.buyerService.validateBuyer([buyerFromCrm.phone]);
      if (buyer) {
        if (buyer.full_name !== shippingCrm?.recipient_full_name) {
          const buyerRecipient = new BuyerRecipientEntity({
            full_name: shippingCrm.recipient_full_name,
            phones: [shippingCrm.recipient_phone],
          });
          buyer.recipients.push(buyerRecipient);
          await this.entityManager.save(buyer);
        }
        return buyer;
      } else {
        const newBuyer = new BuyerEntity({
          full_name: buyerFromCrm.full_name,
          phones: [buyerFromCrm.phone],
          recipients: [],
        });

        const recipientName =
          shippingCrm?.recipient_full_name || newBuyer.full_name;
        const recipientPhone =
          shippingCrm?.recipient_phone || buyerFromCrm.phone;

        const buyerRecipient = new BuyerRecipientEntity({
          full_name: recipientName,
          phones: [recipientPhone],
        });

        newBuyer.recipients.push(buyerRecipient);
        const createdBuyer = await this.buyerService.createBuyer(newBuyer);
        return createdBuyer;
      }
    } catch (error) {
      console.error('An error occurred in syncBuyer:', error);
      throw error;
    }
  }

  private async syncShipping(shippingCrm: TShippingCrm) {
    if (shippingCrm && shippingCrm.shipping_address_city) {
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
      await this.entityManager.save(shipping);
      return { address, shipping };
    }
  }
}
