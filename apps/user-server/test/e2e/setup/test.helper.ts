import { Type } from '@libs/common';
import { ITestHelper } from '@libs/testing';
import { ValidationPipe } from '@nestjs/common';
import {
  LoginUserForTest,
  LoginUserHelper,
} from 'apps/user-server/test/e2e/setup/login-user.helper';
import * as cookieParser from 'cookie-parser';

export class TestHelper extends ITestHelper {
  public loginUsers: {
    user1: LoginUserForTest;
    user2: LoginUserForTest;
  };

  public static create(AppModule: Type) {
    return new TestHelper(AppModule);
  }

  public async appSetup(): Promise<void> {
    this.app.use(cookieParser());
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    this.loginUsers = await LoginUserHelper.create(this);
  }
}
