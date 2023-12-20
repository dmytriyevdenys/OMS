import { InternetDocumnetEntity } from "src/novaposhta/internet-document/entities/internet-document.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RecipientEntity { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Ref: string;

    @Column()
    FirstName: string;

    @Column({nullable: true})
    MiddleName: string;

    @Column()
    LastName: string;

    @Column()
    Phone: string;

    @Column({nullable: true})
    Email: string;

    @Column()
    CounterpartyType: string;

    @Column({nullable: true})
    CounterpartyProperty: string;

    @Column()
    ContactRef: string;

    @OneToOne(() => InternetDocumnetEntity)
    en: InternetDocumnetEntity;

    constructor (entity: Partial<RecipientEntity>) {
        Object.assign(this, entity);
    }
}