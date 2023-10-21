import { RecipientEntity } from "src/novaposhta/recipient/entities/recipient.entity";
import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";


@Entity()
export class InternetDocumnetEntity extends AbstractEntity<InternetDocumnetEntity> {

    @Column()
    IntDocNumber: number;

    @Column()
    Ref: string;

    @Column()
    CostOnSite: number;

    @Column()
    EstimatedDeliveryDate: string;

    @OneToOne(() => RecipientEntity, {cascade: true})
    @JoinColumn()
    recipient: RecipientEntity

}