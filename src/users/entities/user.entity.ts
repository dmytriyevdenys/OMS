import { OrderEntity } from "src/orders/entities/order.entity";
import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { ProfileEntity } from "./profile.entity";

@Entity()
export class UserEntity extends AbstractEntity<UserEntity> { 

    @Column()
    email:string;

    @Column()
    password: string;

    @Column()
    name: string;

    @OneToOne (() => ProfileEntity, profile => profile.user)
    @JoinColumn()
    profile: ProfileEntity

    @OneToMany(() => OrderEntity, order => order.user)
    orders: OrderEntity[];


}