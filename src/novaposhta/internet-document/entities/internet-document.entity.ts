import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity } from "typeorm";


@Entity()
export class InternetDocumnetEntity extends AbstractEntity<InternetDocumnetEntity> {

    @Column()
    IntDocNumber: number;

    @Column()
    Ref: string;

    @Column()
    CostOnSite: number;

    @Column()
    EstimatedDeliveryDate: Date;
}