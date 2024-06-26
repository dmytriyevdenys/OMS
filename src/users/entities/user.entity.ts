import { OrderEntity } from "src/orders/entities/order.entity";
import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { ProfileEntity } from "./profile.entity";
import { RoleEntity } from "./role.entity";

@Entity()
export class UserEntity extends AbstractEntity<UserEntity> { 

    @Column()
    email:string;

    @Column()
    password: string;

    @Column()
    name: string;

    @ManyToOne(() => RoleEntity)
    role: RoleEntity;

    @OneToOne (() => ProfileEntity, profile => profile.user, {cascade: true, eager: true})
    @JoinColumn()
    profile: ProfileEntity

    @OneToMany(() => OrderEntity, order => order.user)
    orders: OrderEntity[];

}