import { AbstractEntity } from 'src/utils/abstract-entity';
import { Column, Entity } from 'typeorm';

export abstract class AbstractPaymentEntity<T> extends AbstractEntity<T>  {
  @Column()
  name: string;

  @Column()
  label: string;

  @Column({ default: 0 })
  value: number;
}
