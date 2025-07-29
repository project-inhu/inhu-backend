import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from 'apps/user-server/test/e2e/setup/test.helper';

describe('s3-upload E2E test', () => {
  const testHelper = TestHelper.create(AdminServerModule);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });
});
