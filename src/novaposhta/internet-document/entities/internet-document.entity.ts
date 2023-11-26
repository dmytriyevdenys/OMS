import { RecipientEntity } from "src/novaposhta/recipient/entities/recipient.entity";
import { OrderEntity } from "src/orders/entities/order.entity";
import { PackerEntity } from "src/packer/entities/packer.entity";
import { AbstractEntity } from "src/utils/abstract-entity";
import { AfterInsert, Column, Entity, InsertEvent, JoinColumn, ManyToOne, OneToOne, getRepository } from "typeorm";


@Entity()
export class InternetDocumnetEntity extends AbstractEntity<InternetDocumnetEntity> {

    @Column({nullable: true})
    IntDocNumber: string;

    @Column({nullable: true})
    order_id: string;

    @Column({nullable: true})
    status: string

    @Column({nullable: true})
    Ref: string;

    @Column({nullable: true})
    CostOnSite: string;

    @Column({nullable: true})
    EstimatedDeliveryDate: string;

    @OneToOne(() => RecipientEntity, {cascade: true})
    @JoinColumn()
    recipient: RecipientEntity

    @OneToOne(() => OrderEntity, order => order.shipping)
    order: OrderEntity

    @ManyToOne(() => PackerEntity, packer => packer.internet_document)
    packer: PackerEntity ;
    
}


