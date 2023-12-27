import { AbstractEntity } from "src/utils/abstract-entity";
import { Entity,Column, ManyToOne } from "typeorm";
import { BuyerEntity } from "./buyer.entity";


@Entity()
export class PhoneEntity extends AbstractEntity<PhoneEntity> {

    @Column()
    phone: string;

    @ManyToOne(() => BuyerEntity, (buyer) => buyer.phones, {onUpdate: 'SET NULL', onDelete: 'CASCADE'})
    buyer: BuyerEntity;
}   