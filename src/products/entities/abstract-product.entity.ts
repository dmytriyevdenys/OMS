import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

export abstract class AbstractProductEntity<T>  {
    @PrimaryColumn()
    id: number;

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

    @CreateDateColumn({name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date

    constructor (entity: Partial<T>) {
        Object.assign(this, entity);
    }
}