// controller - redirectToKakaoLogin의 return
export class KakaoRedirectResponseDto{
    redirectUri: string;
}

// controller - loginWithKakao의 return (Q.auth의 AuthTokensDto랑 같음 -> 없앨지?)
export class KakaoCallbackResponseDto{
    message: string;
    jwtAccessToken: string; // jwt
    jwtRefreshToken: string;
}

// service - getKakaoAccessToken의 return 
export class KakaoAccessTokenDto {
  token_type: string; // 토큰 타입, 항상 "bearer"
  access_token: string; // kakao 사용자 액세스 토큰 값
  id_token?: string; // ID 토큰 값 (OpenID Connect 활성화 시)
  expires_in: number; // 액세스 토큰 및 ID 토큰의 만료 시간 (초)
  refresh_token?: string; // 사용자 리프레시 토큰 값
  refresh_token_expires_in?: number; // 리프레시 토큰 만료 시간 (초)
  scope?: string; // 인증된 사용자의 정보 조회 권한 범위
}

// service - getKakaoUserInfo의 return
export class KakaoUserInfoDto {
  id: number; // 회원번호 (필수 반환)
  has_signed_up?: boolean; // 자동 연결 설정 여부
  connected_at?: string; // 서비스에 연결 완료된 시간 (ISO-8601)
  synched_at?: string; // 카카오싱크 간편가입 인한 시간 (ISO-8601)
  properties?: {
    nickname?: string; // 사용자 닉네임
    profile_image?: string; // 프로필 이미지 URL
    thumbnail_image?: string; // 썸네일 이미지 URL
  };
  kakao_account?: {
    email?: string; // 이메일
    has_email?: boolean; // 이메일 보유 여부
    email_needs_agreement?: boolean; // 이메일 제공 동의 필요 여부
    profile?: {
      nickname?: string; // 닉네임
      profile_image_url?: string; // 프로필 이미지 URL
      thumbnail_image_url?: string; // 썸네일 이미지 URL
    };
  };
  for_partner?: {
    uuid?: string; // 추가 정보 (파트너용)
  };
}



