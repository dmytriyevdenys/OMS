import { Injectable } from '@nestjs/common';
import { createMongoAbility, MongoAbility, AbilityBuilder } from '@casl/ability';
import { UserEntity } from 'src/users/entities/user.entity';

export type Actions = 'create_order' | 'manage_catalog' | 'modify_clients' | 'view_all';
type Subjects = 'orders' | 'catalog' | 'clients' | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    const role = user.role;
    if (role) {
      role.permissions.forEach(permission => {
        const action = permission.name as Actions;
        const subject = permission.group_name as Subjects;
          can(action, subject);
      });
    } 
    const ability = build();
    return ability;
  }
}
