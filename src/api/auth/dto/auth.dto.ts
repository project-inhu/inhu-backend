// 이게 필요한가?
export class LoginDto {
    code: string;
}

export class LoginResponseDto{
    accessToken: string; // jwt
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
