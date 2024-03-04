import { BuyerEntity } from "src/buyer/entities/buyer.entity";
import { InternetDocumnetEntity } from "src/novaposhta/internet-document/entities/internet-document.entity";
import { SenderEntity } from "src/novaposhta/sender/entities/sender.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne,  } from "typeorm";
import { PaymentEntity } from "./payments/payment.entity";
import { OrderStatusEntity } from "./order-status.entity";

@Entity()
export class OrderEntity extends AbstractEntity<OrderEntity> {
    
    @Column({nullable: true})
    orderCrm_id: string;

   @ManyToOne(() => OrderStatusEntity, status => status.orders, {onUpdate: 'SET NULL', onDelete: 'SET NULL'})
   @JoinColumn({name: 'status_id'})
    status: OrderStatusEntity;

    @Column({nullable: true})
    additionalnformation: string;

    @Column({nullable: true})
    totalPrice: number;
    
    @OneToOne(() => PaymentEntity, payment => payment.order_id, { eager: true, cascade: true, onDelete: 'SET NULL', onUpdate: 'SET NULL' })
    @JoinColumn({ name: 'payment_id' })
    payment: PaymentEntity;

    @Column({type: "simple-array", nullable: true})
    notes: string[];


    @ManyToOne(() => UserEntity, user => user.orders, {cascade: true})
    @JoinColumn({name: 'user_id'})
    user: UserEntity

    @ManyToOne(() => BuyerEntity, buyer => buyer.orders, {onUpdate: 'SET NULL', onDelete: 'SET NULL'})
    @JoinColumn({name: 'buyer_id'})
    buyer: BuyerEntity;

    @ManyToMany(() => ProductEntity, {cascade: true, onDelete: 'SET NULL', onUpdate: 'SET NULL'})
    @JoinTable() 
    products: ProductEntity[]

    @ManyToOne(() => SenderEntity, sender => sender.orders, {cascade: true, onDelete: 'SET NULL', onUpdate: 'SET NULL'})
    @JoinColumn({name: 'sender_id'})
    sender: SenderEntity

    @OneToOne(() => InternetDocumnetEntity, {eager: true, cascade: true, onDelete: 'SET NULL', onUpdate: 'SET NULL'})
    @JoinColumn()
    shipping: InternetDocumnetEntity

}