import { PartialType } from '@nestjs/swagger';
import { CreateMenuInput } from './create-menu.input';

export class UpdateMenuInput extends PartialType(CreateMenuInput) {}
