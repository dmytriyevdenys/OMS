import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { OrderEntity } from '../../orders/entities/order.entity';
import { AbstractPaymentEntity } from './abstract-payment.entity';
import { PaymentMethodEntity } from './payment-method.entity';

@Entity()
export class PaymentEntity extends AbstractPaymentEntity<PaymentEntity> {
  @Column({ default: 0 })
  value: number;
  
  @ManyToOne(() => PaymentMethodEntity, (method) => method.id, {
    cascade: true,
  })
  payment_method_id: number;

  @OneToOne(() => OrderEntity, (order) => order.payment)
  @JoinColumn({ name: 'order_id' })
  order_id: OrderEntity;
}
