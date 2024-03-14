import { AbstractEntity } from "src/utils/abstract-entity";
import { Column } from "typeorm";

export abstract class AbstractCustomerEntity<T> extends AbstractEntity<T> {
    @Column({nullable: true})
    full_name: string;

    @Column('simple-array', { nullable: true })
    phones: string[]; 

    @Column({nullable: true})
    email: string;
}