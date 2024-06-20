import { Entity, OneToMany } from "typeorm";
import { AbstractPaymentEntity } from "./abstract-payment.entity";
import { PaymentEntity } from "./payment.entity";

@Entity()
export class PaymentMethodEntity extends AbstractPaymentEntity<PaymentMethodEntity> {
    @OneToMany(() => PaymentEntity,(payment) => payment.id )
    payment_id: PaymentEntity

}