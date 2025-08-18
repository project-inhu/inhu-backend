import { PartialType } from '@nestjs/swagger';
import { CreateKeywordInput } from './create-keyword.input';

/**
 * UpdateKeywordInput 클래스
 *
 * @publicApi
 */
export class UpdateKeywordInput extends PartialType(CreateKeywordInput) {}
