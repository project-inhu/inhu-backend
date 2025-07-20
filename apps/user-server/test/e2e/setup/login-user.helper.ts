import { INestApplication, Type } from '@nestjs/common';
import { LoginTokenService } from '@user/common/module/login-token/login-token.service';

export type LoginUserForTest = {
  idx: number;
  web: {
    accessToken: string;
    refreshToken: string;
  };
  app: {
    accessToken: string;
    refreshToken: string;
  };
};

export class LoginUserHelper {
  constructor(app: INestApplication) {
    app.get(LoginTokenService).issueTokenSet();
  }
}
