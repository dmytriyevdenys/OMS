import { InternetDocumnetEntity } from "src/novaposhta/internet-document/entities/internet-document.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RecipientEntity { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    FirstName: string;

    @Column()
    MiddleName: string;

    @Column()
    LastName: string;

    @Column()
    Phone: string;

    @Column()
    Email: string;

    @Column()
    CounterpartyType: string;

    @Column()
    CounterpartyProperty: string;

    @OneToOne(() => InternetDocumnetEntity)
    en: InternetDocumnetEntity;

    constructor (entity: Partial<RecipientEntity>) {
        Object.assign(this, entity);
    }
}