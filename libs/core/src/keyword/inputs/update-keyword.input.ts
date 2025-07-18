import { PartialType } from '@nestjs/swagger';
import { CreateKeywordInput } from './create-keyword.input';

export class UpdateKeywordInput extends PartialType(CreateKeywordInput) {}
