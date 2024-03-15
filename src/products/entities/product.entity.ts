import {
  Entity,
  Index,
  OneToMany,
} from 'typeorm';
import { AbstractProductEntity } from './abstract-product.entity';
import { OrderProductEntity } from './order-product.entity';

@Entity()
@Index(['name', 'sku'], { unique: true })
export class ProductEntity extends AbstractProductEntity<ProductEntity> {
 
  @OneToMany(() => OrderProductEntity, (product) => product.product)
  order_product: OrderProductEntity[];

}
