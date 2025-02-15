import { BadRequestException, Injectable } from '@nestjs/common';
import { kakaoAuthService } from '../service/social/kakao-auth.service';

@Injectable()
export class SocialAuthFactory {
  constructor(private readonly kakaoAuthService: kakaoAuthService) {}

  getAuthService(provider: string) {
    switch (provider) {
      case 'kakao':
        return this.kakaoAuthService;
      default:
        throw new BadRequestException('Unsupported Service');
    }
  }
}
