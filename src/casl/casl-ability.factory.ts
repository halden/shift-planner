import { AbilityBuilder, ExtractSubjectType, InferSubjects, MatchConditions, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Action } from './enums/action.enum';
import { Role } from 'src/users/enums/role.enum';

export type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = PureAbility<[Action, Subjects], MatchConditions>;
const conditionsMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);

    if (user.role === Role.Admin) {
      can(Action.Manage, 'all');
    } else {
      cannot(Action.Create, 'all');
      can(Action.Read, 'all');
      cannot(Action.Update, 'all');
      cannot(Action.Delete, 'all');
    }

    return build({
      conditionsMatcher,
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
