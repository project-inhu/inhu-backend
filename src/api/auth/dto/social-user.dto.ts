import { AuthProvider } from "../enum/auth-provider.enum";

export interface SocialUserInfoDto {
  id: string; // 소셜 로그인 제공자에서 제공하는 사용자 ID
  provider: AuthProvider; // 로그인 제공자 (Kakao, Google, Apple 등)
}