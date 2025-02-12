// 이게 필요한가?
export class LoginDto {
    code: string;
}

// LoginResponseDto와 같은 역할
export class AuthTokensDto{
    jwtAccessToken: string;
    jwtRefreshToken: string;
}

export class UserDto {
  idx: number;
  nickname: string;
}

export class UserProviderDto {
  idx: number;
  snsId: string;
  provider: number;
}
