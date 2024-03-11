import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, OneToMany, } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity()
export class OrderStatusEntity extends AbstractEntity<OrderStatusEntity> {

    @Column()
    name: string;

    @Column()
    alias: string;

    @Column()
    color: string;
 
    @Column()
    is_active: boolean;

    @OneToMany(() => OrderEntity, order => order.status,)
    orders: OrderEntity[];
} 