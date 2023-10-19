import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RecipientEntity { 
    @PrimaryGeneratedColumn()
    id: number;

    


    constructor (entity: Partial<RecipientEntity>) {
        Object.assign(this, entity);
    }
}