import { Entity, ManyToOne } from "typeorm";
import { AbstractCustomerEntity } from "./abstract-customer.entity";
import { BuyerEntity } from "./buyer.entity";

@Entity()
export class BuyerRecipientEntity extends AbstractCustomerEntity<BuyerRecipientEntity> {
    @ManyToOne(() => BuyerEntity, buyer => buyer.recipients)
    buyer: BuyerEntity
}