import { ITestHelper } from '@libs/testing/interface/test-helper.interface';
import { Type } from '@libs/common/types/Type';

export class TestHelper extends ITestHelper {
  /**
   * init 메서드를 사용한 이후부터 사용할 수 있습니다.
   */
  public static create(AppModule: Type) {
    return new TestHelper(AppModule);
  }

  public async appSetup(): Promise<void> {}
}
