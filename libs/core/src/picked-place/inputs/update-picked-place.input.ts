import { CreatePickedPlaceInput } from '@app/core/picked-place/inputs/create-picked-place.input';
import { PartialType } from '@nestjs/swagger';

export class UpdatePickedPlaceInput extends PartialType(
  CreatePickedPlaceInput,
) {}
