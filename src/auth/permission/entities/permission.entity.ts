import { AbstractEntity } from "src/utils/abstract-entity";
import { Column, Entity, ManyToMany } from "typeorm";
import { RoleEntity } from "../../role/entities/role.entity";

@Entity()
export class PermissionEntity extends AbstractEntity<PermissionEntity> {
  @Column()
  name: string;

  @Column()
  guard_name: string;

  @Column()
  group_name: string;

  @Column()
  position: number;

  @ManyToMany(() => RoleEntity, role => role.permissions)
  roles: RoleEntity[];
}