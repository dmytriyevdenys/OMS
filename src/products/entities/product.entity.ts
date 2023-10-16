import { OrderEntity } from "src/orders/entities/order.entity";
import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, CreateDateColumn, Entity, Index, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Index(['name', 'sku'], {unique: true})
export class ProductEntity  {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true, type: "float"})
    quantity: number | null;

    @Column({nullable: true, type: "double precision"})
    weight: number | null;

    @Column({nullable: true})
    sku: string | null;

    @Column({nullable: true})
    price: number;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @ManyToMany(() => OrderEntity, order => order.products)
    order: OrderEntity[]

    constructor (entity: Partial<ProductEntity>) {
        Object.assign(this, entity)
    }

}