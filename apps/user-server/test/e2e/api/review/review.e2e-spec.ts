import { AppModule } from '@user/app.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('Review E2E test', () => {
  const testHelper = TestHelper.create(AppModule);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /review/all', () => {});
});
