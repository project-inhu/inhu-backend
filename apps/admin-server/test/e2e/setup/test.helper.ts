import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { LoginAdminForTest, LoginAdminHelper } from './login-admin.helper';
import { ITestHelper } from '@libs/testing/interface/test-helper.interface';
import { Type } from '@libs/common/types/Type';

export class TestHelper extends ITestHelper {
  /**
   * init 메서드를 사용한 이후부터 사용할 수 있습니다.
   */
  public loginAdmin: {
    admin1: LoginAdminForTest;
    admin2: LoginAdminForTest;
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

    this.loginAdmin = await LoginAdminHelper.create(this);
  }
}
