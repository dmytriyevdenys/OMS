import { BuyerEntity } from "src/buyer/entities/buyer.entity";
import { SenderEntity } from "src/novaposhta/sender/entities/sender.entity";
import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class AddressEntity extends AbstractEntity<AddressEntity> {
    
    @Column()
    CityDescription: string;

    @Column()
    CityRef: string;

    @Column()
    SettlementRef: string;

    @Column()
    SettlementDescription: string;

    @Column()
    Description: string;

    @Column()
    Ref: string;

    @Column()
    Number: string;

    @ManyToOne(() => SenderEntity)
    sender: SenderEntity

    @ManyToOne(() => BuyerEntity)
    buyer: BuyerEntity
    
}
