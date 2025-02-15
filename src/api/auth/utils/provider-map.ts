import { KakaoAuthService } from "../service/kakao-auth.service";

export const providerMap = {
  kakao: {
    id: 0, // ✅ DB 저장용 ID
    service: KakaoAuthService, // ✅ Controller → Service 연결용
  }
//   google: {
//     id: 1,
//     service: GoogleAuthService,
//   },
//   apple: {
//     id: 2,
//     service: AppleAuthService,
//   },
} as const;
