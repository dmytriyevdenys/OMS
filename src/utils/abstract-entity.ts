import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class AbstractEntity<T> {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date

    constructor (entity: Partial<T>) {
        Object.assign(this, entity);
    }
}