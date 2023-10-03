import { UserEntity } from "src/users/entities/user.entity";
import { BaseEntity } from "src/utils/base-entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class OrderEntity extends BaseEntity {
    
    @Column()
    orderCrm_id: string;

    @Column()
    status_id: string;

    @Column()
    additionalnformation: string;

    @Column()
    totalPrice: number;

    @Column()
    notes: string;

    @ManyToOne(() => UserEntity, user => user.orders)
    user: UserEntity
 
    constructor(order: Partial<OrderEntity>) {
        super()
        Object.assign(this, order)
    }
}