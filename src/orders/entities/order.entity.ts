import { BuyerEntity } from "src/buyer/entities/buyer.entity";
import { SenderEntity } from "src/novaposhta/sender/entities/sender.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne,  } from "typeorm";

@Entity()
export class OrderEntity extends AbstractEntity<OrderEntity> {
    
    @Column({nullable: true})
    orderCrm_id: string;

    @Column({default: 1, nullable: true})
    status_id: number;

    @Column({nullable: true})
    additionalnformation: string;

    @Column({nullable: true})
    totalPrice: number;

    @Column({type: "simple-array", nullable: true})
    notes: string[];


    @ManyToOne(() => UserEntity, user => user.orders, {cascade: true})
    @JoinColumn({name: 'user_id'})
    user: UserEntity

    @ManyToOne(() => BuyerEntity, buyer => buyer.orders, {onUpdate: 'SET NULL', onDelete: 'SET NULL'})
    @JoinColumn({name: 'buyer_id'})
    buyer: BuyerEntity;

    @ManyToMany(() => ProductEntity, {onDelete: 'SET NULL', onUpdate: 'SET NULL'})
    @JoinTable()
    products: ProductEntity[]

    @ManyToOne(() => SenderEntity, sender => sender.orders, {onDelete: 'SET NULL', onUpdate: 'SET NULL'})
    @JoinColumn({name: 'sender_id'})
    sender: SenderEntity

}