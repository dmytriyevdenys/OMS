import { OrderEntity } from "src/orders/entities/order.entity";
import {  Entity, JoinColumn, OneToMany } from "typeorm";
import { AddressEntity } from "src/novaposhta/address/entities/address.entity";
import { AbstractCustomerEntity } from "./abstract-customer.entity";
import { BuyerRecipientEntity } from "./buyer-recipient.entity";


@Entity()
export class BuyerEntity extends AbstractCustomerEntity<BuyerEntity> {

    @OneToMany(() => OrderEntity, order => order.buyer)
    @JoinColumn({name: 'order_id'})
    orders: OrderEntity[];

    @OneToMany(() => AddressEntity, address => address.buyer,{cascade: true})
    addresses: AddressEntity[]
     
    @OneToMany(() => BuyerRecipientEntity, recipient => recipient.buyer)
    recipients: BuyerRecipientEntity[]
}