import { Entity } from "typeorm";
import { AbstractPaymentEntity } from "./abstract-payment.entity";

@Entity()
export class PaymentMethodEntity extends AbstractPaymentEntity<PaymentMethodEntity> {

}