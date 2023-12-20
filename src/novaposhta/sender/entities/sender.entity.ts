import { AbstractEntity } from 'src/utils/abstract-entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import { ContractPersonEntity } from './contact-person.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { AddressEntity } from 'src/novaposhta/address/entities/address.entity';

@Entity()
@Unique(['apiKey'])
export class SenderEntity extends AbstractEntity<SenderEntity> {
  @Column({ nullable: true })
  nickName: string;

  @Column({ name: 'api_key' })
  apiKey: string;

  @Column()
  Ref: string;

  @Column()
  CounterpartyType: string;

  @Column()
  Description: string;

  @Column({ nullable: true })
  Phones: string;

  @Column({ nullable: true })
  Email: string;

  @Column({ nullable: true })
  LastName: string;

  @Column()
  FirstName: string;

  @Column({ nullable: true })
  MiddleName: string;

  @Column({ default: false })
  isDefault: boolean;

  @OneToOne(() => ContractPersonEntity, { cascade: true , eager: true})
  @JoinColumn()
  Contact: ContractPersonEntity;

  @OneToMany(() => AddressEntity, (address) => address.sender, {
    cascade: ['remove','update'],
    onUpdate: 'SET NULL',
    onDelete: 'SET NULL',
    eager: true
  })
  address: AddressEntity[];

  @OneToMany(() => OrderEntity, (order) => order.sender)
  orders: OrderEntity[];
}
