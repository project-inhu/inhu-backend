import { HashService } from '@admin/common/modules/hash/hash.service';
import { LoginTokenService } from '@admin/common/modules/login-token/login-token.service';
import { ITestHelper } from '@libs/testing';

export type LoginAdminForTest = {
  idx: number;
  id: string;
  token: string;
};

export class LoginAdminHelper {
  public static async create(testHelper: ITestHelper): Promise<{
    admin1: LoginAdminForTest;
    admin2: LoginAdminForTest;
  }> {
    const [user1, user2] = await Promise.all([
      testHelper.getPrisma().user.create({
        data: {
          nickname: 'admin-1-nick',
          profileImagePath: null,
        },
      }),
      testHelper.getPrisma().user.create({
        data: {
          nickname: 'admin-2-nick',
          profileImagePath: null,
        },
      }),
    ]);

    const [admin1, admin2] = await Promise.all([
      testHelper.getPrisma().adminAccount.create({
        data: {
          idx: user1.idx,
          id: 'admin-1-id',
          pw: await testHelper.get(HashService).hash('admin-1-pw'),
        },
      }),
      testHelper.getPrisma().adminAccount.create({
        data: {
          idx: user2.idx,
          id: 'admin-2-id',
          pw: await testHelper.get(HashService).hash('admin-2-pw'),
        },
      }),
    ]);

    const [admin1Token, admin2Token] = await Promise.all([
      await testHelper.get(LoginTokenService).generateAdminToken(admin1.idx),
      await testHelper.get(LoginTokenService).generateAdminToken(admin2.idx),
    ]);

    return {
      admin1: {
        idx: admin1.idx,
        id: admin1.id,
        token: admin1Token,
      },
      admin2: {
        idx: admin2.idx,
        id: admin2.id,
        token: admin2Token,
      },
    };
  }
}
