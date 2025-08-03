import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { GetUserOverviewAllDto } from '@admin/api/user/dto/request/get-user-overview-all.dto';
import { UserOverviewEntity } from '@admin/api/user/entity/user-overview.entity';
import { UserSeedHelper } from '@libs/testing/seed/user/user.seed';

describe('User E2E test', () => {
  let testHelper = TestHelper.create(AdminServerModule);
  let userSeedHelper = testHelper.seedHelper(UserSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('Get /user/overview', () => {
    it('200 - should return a list of users', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetUserOverviewAllDto = { page: 1 };

      const [user1, user2] = await userSeedHelper.seedAll([
        { nickname: 'user1', social: { provider: 'kakao' } },
        { nickname: 'user2', social: { provider: 'apple' } },
      ]);

      const response = await testHelper
        .test()
        .get('/user')
        .set('Cookie', `Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const userList: UserOverviewEntity[] = response.body.userList;
      const count: number = response.body.count;

      // idx desc 정렬 확인
      const firstUserInList = userList[0];
      expect(firstUserInList.idx).toBe(user2.idx);
      expect(firstUserInList.nickname).toBe(user2.nickname);
      expect(firstUserInList.provider?.provider).toBe(user2.social?.provider);

      const secondUserInList = userList[1];
      expect(secondUserInList.idx).toBe(user1.idx);
      expect(secondUserInList.nickname).toBe(user1.nickname);
      expect(secondUserInList.provider?.provider).toBe(user1.social?.provider);
    });

    it('200 - should return the second page of users', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetUserOverviewAllDto = { page: 2 };

      await userSeedHelper.seedAll(new Array(12).fill({}));

      const response = await testHelper
        .test()
        .get('/user')
        .set('Cookie', `Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const userList: UserOverviewEntity[] = response.body.userList;
      const count: number = response.body.count;

      expect(count).toBe(12);

      expect(userList).toHaveLength(2);
    });

    it('200 - should not include soft-deleted users', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto: GetUserOverviewAllDto = { page: 1 };

      await userSeedHelper.seedAll([{}, {}, { deletedAt: new Date() }]);

      const response = await testHelper
        .test()
        .get('/user')
        .set('Cookie', `Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const userList: UserOverviewEntity[] = response.body.userList;
      const count: number = response.body.count;

      expect(count).toBe(2);
      expect(userList).toHaveLength(2);
    });

    it('200 - should not include admin accounts', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const admin2 = testHelper.loginAdmin.admin2;
      const dto: GetUserOverviewAllDto = { page: 1 };

      const regularUser = await userSeedHelper.seed({});

      const response = await testHelper
        .test()
        .get('/user')
        .set('Cookie', `Bearer ${loginUser.token}`)
        .query(dto)
        .expect(200);

      const userList: UserOverviewEntity[] = response.body.userList;
      const count: number = response.body.count;

      expect(count).toBe(1);
      expect(userList).toHaveLength(1);
      expect(userList[0].idx).toBe(regularUser.idx);

      const admin2ExistsInList = userList.some(
        (user) => user.idx === admin2.idx,
      );
      expect(admin2ExistsInList).toBe(false);
    });

    it('401 - no access token provided', async () => {
      const dto: GetUserOverviewAllDto = {
        page: 1,
      };

      await testHelper.test().get('/user').query(dto).expect(401);
    });

    it('400 - invalid page type', async () => {
      const loginUser = testHelper.loginAdmin.admin1;
      const dto = { page: 'abc' };

      await testHelper
        .test()
        .get('/user')
        .set('Cookie', `Bearer ${loginUser.token}`)
        .query(dto)
        .expect(400);
    });
  });
});
