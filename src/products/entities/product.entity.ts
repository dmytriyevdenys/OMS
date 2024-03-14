import { OrderEntity } from 'src/orders/entities/order.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
} from 'typeorm';
import { AbstractEntity } from 'src/utils/abstract-entity';

@Entity()
@Index(['name', 'sku'], { unique: true })
export class ProductEntity extends AbstractEntity<ProductEntity> {
  @Column()
  name: string;

  @Column({ nullable: true, type: 'float' })
  quantity: number | null;

  @Column({ nullable: true, type: 'double precision' })
  weight: number | null;

  @Column({ nullable: true })
  sku: string ;

  @Column({ nullable: true })
  price: number;

  @Column({default: false})
  custom_item: boolean;
  
  @ManyToMany(() => OrderEntity, (order) => order.products)
  order: OrderEntity[];
}
