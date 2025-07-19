import { Type } from '@libs/common';
import { ITestHelper } from '@libs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

export class TestHelper extends ITestHelper {
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
  }
}
