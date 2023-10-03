import { OrderEntity } from "src/orders/entities/order.entity";
import { BaseEntity } from "src/utils/base-entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class UserEntity extends BaseEntity { 

    @Column()
    email:string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    manager_id:number;

    @Column({ nullable: true })
    manager_name: string;

    @Column({ nullable: true })
    source_id: number;

    @Column({ nullable: true })
    source_name: string

    @OneToMany(() => OrderEntity, order => order.user)
    orders: OrderEntity[];

    constructor (user: Partial<UserEntity>) {
        super ()
        Object.assign(this, user);
    }
}