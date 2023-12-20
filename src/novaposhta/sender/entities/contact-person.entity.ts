import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ContractPersonEntity {

    @PrimaryGeneratedColumn({name: 'contact_id'})
    id: number;

    @Column()
    Ref: string;

    @Column()
    Description: string;

    @Column()
    Phones: string;

    @Column()
    Email: string;

    @Column()
    FirstName: string;

    @Column()
    LastName: string;

    @Column()
    MiddleName: string;

    constructor (entity: Partial<ContractPersonEntity>) {
        Object.assign(this, entity);
    }
}