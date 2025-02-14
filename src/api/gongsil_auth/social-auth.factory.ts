import { BadRequestException, Injectable } from '@nestjs/common';
import { kakaoAuthService } from './kakao-auth.service';

@Injectable()
export class SocialAuthFactory {
  constructor(private readonly kakaoAuthService: kakaoAuthService) {}

  getAuthService(provider: string) {
    switch (provider) {
      case 'kakao':
        return this.kakaoAuthService;
      default:
        throw new BadRequestException('지원되지 않는 서비스스입니다.');
    }
  }
}
