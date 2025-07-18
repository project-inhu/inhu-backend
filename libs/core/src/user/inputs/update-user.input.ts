import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserInput } from './create-user.input';

export class UpdateUserInput extends PartialType(
  PickType(CreateUserInput, ['nickname', 'profileImagePath']),
) {}
