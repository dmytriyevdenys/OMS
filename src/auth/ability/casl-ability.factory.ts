import { Injectable } from '@nestjs/common';
import { createMongoAbility, MongoAbility } from '@casl/ability';
import { UserEntity } from 'src/users/entities/user.entity';
import { Action } from './actions.enum';

type Subjects = 'orders' | 'catalog' | 'clients' | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const ability = createMongoAbility<AppAbility>();

    const role = user.role; 
    if (role) {
      role.permissions.forEach(permission => {
        const action = permission.name as Action;
        if (Object.values(Action).includes(action)) {
          const subject = permission.group_name as Subjects;
          ability.can(action, subject);
        } else {
          console.warn(`Invalid action: ${permission.name}`);
        }
      });
    } else {
      ability.cannot(Action.ManageCatalog, 'all');
    }
    console.log('Created Ability:', ability); // Друкує створений Ability об'єкт

    return ability;
  }
}
