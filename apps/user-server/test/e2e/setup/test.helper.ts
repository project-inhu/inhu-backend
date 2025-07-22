import { DateUtilService, Type } from '@libs/common';
import { DateUtil, ITestHelper } from '@libs/testing';
import { ValidationPipe } from '@nestjs/common';
import {
  LoginUserForTest,
  LoginUserHelper,
} from 'apps/user-server/test/e2e/setup/login-user.helper';
import * as cookieParser from 'cookie-parser';

export class TestHelper extends ITestHelper {
  /**
   * init 메서드를 사용한 이후부터 사용할 수 있습니다.
   */
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

  /**
   * dateUtilService.getNow() 가 return하는
   * 날짜를 특정 시간으로 고정하는 모킹 메서드
   *
   * @example
   * ```typescript
   * // 한국 시간 10시 00분으로 고정됩니다.
   * testHelper.mockTodayTime('10:00');
   * ```
   */
  public mockTodayTime(time: `${number}:${number}`): DateUtil {
    const [hour, minute] = time.split(':').map(Number);
    const dateUtilService = this.app.get(DateUtilService);

    const date = new Date();
    date.setHours(hour, minute, 0, 0); // 시간, 분

    jest.spyOn(dateUtilService, 'getNow').mockReturnValue(date);

    return new DateUtil(date);
  }
}
