import { Injectable } from '@nestjs/common';
import { Actions, AppAbility, Subjects } from './casl-ability.factory';
import { IPolicyHandler } from './policies.guard';

@Injectable()
 class PermissionPolicyHandler implements IPolicyHandler {
  private readonly actions: Actions[];
  private readonly subject: Subjects;

  constructor(requiredActions: Actions[], subject: Subjects) {
    this.actions = requiredActions;
    this.subject = subject;
  }

  handle(ability: AppAbility) {
    return this.actions.every(action => ability.can(action, this.subject));
  }
}

export const createPolicyHandler = (actions: Actions[],subject: Subjects,) => 
  new PermissionPolicyHandler(actions, subject);

