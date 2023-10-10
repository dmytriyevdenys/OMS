import { BuyerEntity } from "src/buyer/entities/buyer.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class OrderEntity extends AbstractEntity<OrderEntity> {
    
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

    @ManyToOne(() => UserEntity, user => user.orders, {cascade: true})
    @JoinColumn({name: 'user_id'})
    user: UserEntity

    @ManyToOne(() => BuyerEntity, buyer => buyer.orders)
    @JoinColumn({name: 'buyer_id'})
    buyer: BuyerEntity;

}