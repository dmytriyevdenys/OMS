import { Entity, JoinColumn, ManyToOne, OneToOne, RelationId, } from "typeorm";
import { OrderEntity } from "../order.entity";
import { AbstractPaymentEntity } from "./abstract-payment.entity";
import { PaymentMethodEntity } from "./payment-method.entity";


@Entity()
export class PaymentEntity extends AbstractPaymentEntity<PaymentEntity> {
    @ManyToOne(() => PaymentMethodEntity, method => method.id, {cascade: true})
    payment_method_id: number;

    @OneToOne(() => OrderEntity, order => order.payment)
    @JoinColumn({name: 'order_id'})
    order_id: OrderEntity;
}