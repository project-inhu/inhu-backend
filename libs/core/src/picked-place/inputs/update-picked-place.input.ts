import { CreatePickedPlaceInput } from './create-picked-place.input';
import { PartialType } from '@nestjs/swagger';

/**
 * UpdatePickedPlaceInput 클래스
 *
 * @publicApi
 */
export class UpdatePickedPlaceInput extends PartialType(
  CreatePickedPlaceInput,
) {}
