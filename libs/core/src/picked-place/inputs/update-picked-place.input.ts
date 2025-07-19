import { CreatePickedPlaceInput } from './create-picked-place.input';
import { PartialType } from '@nestjs/swagger';

export class UpdatePickedPlaceInput extends PartialType(
  CreatePickedPlaceInput,
) {}
