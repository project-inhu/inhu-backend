import { CreatePlaceInput } from './create-place.input';
import { PartialType } from '@nestjs/swagger';

export class UpdatePlaceInput extends PartialType(CreatePlaceInput) {}
