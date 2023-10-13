import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, JoinColumn, OneToOne, Unique } from "typeorm";
import { ContractPersonEntity } from "./contact-person.entity";

@Entity()
@Unique(['apiKey'])
export class SenderEntity extends AbstractEntity<SenderEntity> {
    
    @Column({name: 'api_key'})
    apiKey: string;

    @Column()
    Ref: string;

    @Column()
    CounterpartyType: string;

    @Column()
    Description: string;

    @Column({nullable: true})
    Phones: string;

    @Column({nullable: true})
    Email: string;

    @Column({nullable: true})
    LastName: string;

    @Column()
    FirstName: string;

    @Column({nullable: true})
    MiddleName: string;

    @OneToOne(() => ContractPersonEntity, {cascade: true})
    @JoinColumn()
    Contact: ContractPersonEntity
}