import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractProductEntity } from "./abstract-product.entity";
import { ProductEntity } from "./product.entity";
import { OrderEntity } from "src/orders/entities/order.entity";

@Entity()
export class OrderProductEntity extends AbstractProductEntity<OrderProductEntity> {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    comment: string;

    @ManyToOne(() => ProductEntity, product => product.order_product, { nullable: true })
    product: ProductEntity;

    @ManyToOne(() => OrderEntity, order => order.products)
    order: OrderEntity;
}