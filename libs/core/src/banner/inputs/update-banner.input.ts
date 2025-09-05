import { PartialType } from '@nestjs/swagger';
import { CreateBannerInput } from './create-banner.input';

/**
 * UpdateBannerInput 클래스
 *
 * @publicApi
 */
export class UpdateBannerInput extends PartialType(CreateBannerInput) {
  activatedAt?: Date | null;
}
