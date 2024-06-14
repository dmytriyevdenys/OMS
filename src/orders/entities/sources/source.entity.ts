import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { OrderEntity } from "../order.entity";


@Entity()
export class SourceEntity  {

    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    alias: string;

    @Column({default: true})
    isActive: boolean;

    @OneToMany(() => OrderEntity, order => order.source)
    orders: OrderEntity[]

    @CreateDateColumn({name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date

    constructor (entity: Partial<SourceEntity>) {
        Object.assign(this, entity);
    }
}