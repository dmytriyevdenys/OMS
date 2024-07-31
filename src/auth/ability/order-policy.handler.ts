import { Action } from './actions.enum';
import { AppAbility } from './casl-ability.factory';
import { IPolicyHandler } from './policies.guard';


export class OrderPolicyHandler implements IPolicyHandler {
  private readonly requiredActions: Action[];

  constructor(requiredActions: Action[]) {
    this.requiredActions = requiredActions;
  }

  handle(ability: AppAbility): boolean {
    return this.requiredActions.every(action => ability.can(action, 'orders'));
  }
}
