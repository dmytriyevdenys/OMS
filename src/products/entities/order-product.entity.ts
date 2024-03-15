import { Entity, ManyToOne } from "typeorm";
import { AbstractProductEntity } from "./abstract-product.entity";
import { ProductEntity } from "./product.entity";
import { OrderEntity } from "src/orders/entities/order.entity";

@Entity()
export class OrderProductEntity extends AbstractProductEntity<OrderProductEntity> {
    @ManyToOne(() => ProductEntity, product => product.order_product, {cascade: true})
    product: ProductEntity;

    @ManyToOne(() => OrderEntity, order => order.products)
    order: OrderEntity;
}