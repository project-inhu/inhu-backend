import { BadRequestException, Injectable } from '@nestjs/common';
import { KakaoAuthService } from '../service/kakao-auth.service';
import { SocialAuthBaseService } from '../base/social-auth-base.service';

@Injectable()
export class SocialAuthFactory {
  constructor(private readonly kakaoAuthService: KakaoAuthService) {}

  getAuthService(provider: string): SocialAuthBaseService<any, any> {
    if (provider === 'kakao') {
      return this.kakaoAuthService;
    } else {
      throw new BadRequestException('지원하지 않는 서비스입니다.');
    }
  }
}
