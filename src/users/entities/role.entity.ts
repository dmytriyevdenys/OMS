import { AbstractEntity } from 'src/utils/abstract-entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity()
export class RoleEntity extends AbstractEntity<RoleEntity> {
  @Column({ unique: true })
  name: string;

  @Column()
  color: string;

  @Column()
  alias: string;

  @Column()
  is_reserved: boolean;

  @Column()
  statuses_all: boolean;

  @Column()
  accepted_all: boolean;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable()
  permissions: PermissionEntity[];
}
