import { CreatePlaceInput } from './create-place.input';
import { PartialType } from '@nestjs/swagger';

/**
 * 장소 수정 입력 input
 *
 * @publicApi
 */
export class UpdatePlaceInput extends PartialType(CreatePlaceInput) {}
