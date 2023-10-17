import { OrderEntity } from "src/orders/entities/order.entity";
import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { PhoneEntity } from "./phone.entity";
import { AddressEntity } from "src/novaposhta/address/entities/address.entity";


@Entity()
export class BuyerEntity extends AbstractEntity<BuyerEntity> {

    @Column({nullable: true})
    full_name: string;

    @Column('simple-array', { nullable: true })
    phones: string[]; 

    @Column({nullable: true})
    email: string;

    @OneToMany(() => OrderEntity, order => order.buyer)
    @JoinColumn({name: 'order_id'})
    orders: OrderEntity[];

    @OneToMany(() => AddressEntity, address => address.buyer)
    address: AddressEntity
}