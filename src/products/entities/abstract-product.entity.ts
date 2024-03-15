import { AbstractEntity } from "src/utils/abstract-entity";
import { Column } from "typeorm";

export abstract class AbstractProductEntity<T> extends AbstractEntity<T> {
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
}