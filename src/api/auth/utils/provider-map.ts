import { AuthProvider } from '../enum/auth-provider.enum';
import { KakaoAuthService } from '../service/kakao-auth.service';

export const providerMap = {
  kakao: {
    id: AuthProvider.KAKAO, // DB 저장용
    service: KakaoAuthService, // Controller → Service 연결용
  },
} as const;
