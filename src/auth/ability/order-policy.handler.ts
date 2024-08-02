import { Actions, AppAbility } from './casl-ability.factory';
import { IPolicyHandler } from './policies.guard';


export class OrderPolicyHandler implements IPolicyHandler {
  private readonly requiredActions: Actions[];

  constructor(requiredActions: Actions[]) {
    this.requiredActions = requiredActions;
  }

  handle(ability: AppAbility) {
    return this.requiredActions.every(action => {
      const canPerform = ability.can(action, 'orders');
      return canPerform;
    });
  }
}
