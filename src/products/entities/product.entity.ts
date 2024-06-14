import {
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { AbstractProductEntity } from './abstract-product.entity';
import { OrderProductEntity } from './order-product.entity';

@Entity()
@Index(['name', 'sku'], { unique: true })
export class ProductEntity extends AbstractProductEntity<ProductEntity> {

  @PrimaryColumn()
  id: number;
 
  @OneToMany(() => OrderProductEntity, (product) => product.product ,{nullable: true, })
  order_product: OrderProductEntity[];

}
