import { AppModule } from '@user/app.module';
import { TestHelper } from '../../setup/test.helper';
import {
  BookmarkSeedHelper,
  PickedPlaceSeedHelper,
  PlaceSeedHelper,
} from '@libs/testing';
import { GetAllPickedPlaceOverviewResponseDto } from '@user/api/picked-place/dto/response/get-all-picked-place.response.dto';

describe('Picked Place E2E test', () => {
  const testHelper = TestHelper.create(AppModule);
  const placeSeedHelper = testHelper.seedHelper(PlaceSeedHelper);
  const bookmarkSeedHelper = testHelper.seedHelper(BookmarkSeedHelper);
  const pickedPlaceSeedHelper = testHelper.seedHelper(PickedPlaceSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  it('200 - picked place field check', async () => {
    const placeSeed = await placeSeedHelper.seed({
      activatedAt: new Date(),
      roadAddress: {
        name: 'Test Road',
        detail: 'Test Detail',
        addressX: 123.456,
        addressY: 78.91,
      },
      reviewCount: 5,
      placeImgList: ['/place/test-image1.png', '/place/test-image2.png'],
      keywordCountList: [
        {
          keywordIdx: 1,
          count: 10,
        },
        {
          keywordIdx: 2,
          count: 12,
        },
        {
          keywordIdx: 3,
          count: 8,
        },
      ],
    });

    const pickedPlaceSeed = await pickedPlaceSeedHelper.seed({
      placeIdx: placeSeed.idx,
      title: 'Test Picked Place',
      content: 'This is a test picked place content.',
    });

    const response = await testHelper
      .test()
      .get('/picked-place/all')
      .query({ page: 1 })
      .expect(200);

    const body: GetAllPickedPlaceOverviewResponseDto = response.body;
    const picked = body.pickedPlaceOverviewList[0];

    console.log('Picked Place Overview:', picked);
    expect(picked.idx).toBe(pickedPlaceSeed.idx);
    expect(picked.title).toBe(pickedPlaceSeed.title);
    expect(picked.content).toBe(pickedPlaceSeed.content);

    expect(picked.place.name).toBe(placeSeed.name);
    expect(picked.place.roadAddress.name).toBe(placeSeed.roadAddress.name);
    expect(picked.place.roadAddress.detail).toBe(placeSeed.roadAddress.detail);
    expect(picked.place.roadAddress.addressX).toBe(
      placeSeed.roadAddress.addressX,
    );
    expect(picked.place.roadAddress.addressY).toBe(
      placeSeed.roadAddress.addressY,
    );
    expect(picked.place.reviewCount).toBe(placeSeed.reviewCount);
    expect(picked.place.topKeywordList.map(({ idx }) => idx)).toStrictEqual([
      2, 1,
    ]);
    expect(picked.place.imagePathList.sort()).toEqual(
      picked.place.imagePathList.sort(),
    );
    expect(picked.place.type).toBe(placeSeed.type);
  });

  it('200 - when unauthenticated', async () => {
    const placeSeed = await placeSeedHelper.seed({});

    const pickedPlaceSeed = await pickedPlaceSeedHelper.seed({
      placeIdx: placeSeed.idx,
    });

    const response = await testHelper
      .test()
      .get('/picked-place/all')
      .query({ page: 1 })
      .expect(200);

    const body: GetAllPickedPlaceOverviewResponseDto = response.body;
    const picked = body.pickedPlaceOverviewList[0];

    expect(picked.place.bookmark).toBe(false);
  });

  it('200 - when authenticated', async () => {
    const loginUser = testHelper.loginUsers.user1;

    const placeSeed = await placeSeedHelper.seed({});

    await pickedPlaceSeedHelper.seed({
      placeIdx: placeSeed.idx,
    });

    await bookmarkSeedHelper.seed({
      userIdx: loginUser.idx,
      placeIdx: placeSeed.idx,
    });

    const response = await testHelper
      .test()
      .get('/picked-place/all')
      .query({ page: 1 })
      .set('Authorization', `Bearer ${loginUser.app.accessToken}`)
      .expect(200);

    const body: GetAllPickedPlaceOverviewResponseDto = response.body;
    const picked = body.pickedPlaceOverviewList[0];

    expect(picked.place.bookmark).toBe(true);
  });

  it('200 - hasNext check', async () => {
    // place 10개 생성
    const placeSeedList = await placeSeedHelper.seedAll(
      Array.from({ length: 10 }, () => ({})),
    );

    // 10개의 장소에 대해 picked place 생성
    await pickedPlaceSeedHelper.seedAll(
      placeSeedList.map(({ idx }) => ({
        placeIdx: idx,
      })),
    );

    const response = await testHelper
      .test()
      .get('/picked-place/all')
      .query({ page: 1 })
      .expect(200);

    expect(response.body.hasNext).toBe(false);

    // 장소 1개 더 생성
    const placeSeed = await placeSeedHelper.seed({});

    // 해당 장소에 대해 picked place 생성
    await pickedPlaceSeedHelper.seed({
      placeIdx: placeSeed.idx,
    });

    const response2 = await testHelper
      .test()
      .get('/picked-place/all')
      .query({ page: 1 })
      .expect(200);

    expect(response2.body.hasNext).toBe(true);
  });

  it('200 - sort order check', async () => {
    const firstPlaceSeed = await placeSeedHelper.seed({});
    const secondPlaceSeed = await placeSeedHelper.seed({});

    const firstPickedPlaceSeed = await pickedPlaceSeedHelper.seed({
      placeIdx: firstPlaceSeed.idx,
    });

    // 시간 간격을 두어 생성 순서를 명확히 함
    await new Promise((resolve) => setTimeout(resolve, 20));

    const secondPickedPlaceSeed = await pickedPlaceSeedHelper.seed({
      placeIdx: secondPlaceSeed.idx,
    });

    const response = await testHelper
      .test()
      .get('/picked-place/all')
      .query({ page: 1 })
      .expect(200);

    const { pickedPlaceOverviewList }: GetAllPickedPlaceOverviewResponseDto =
      response.body;

    expect(pickedPlaceOverviewList[0].idx).toBe(secondPickedPlaceSeed.idx);
    expect(pickedPlaceOverviewList[1].idx).toBe(firstPickedPlaceSeed.idx);
  });

  it('200 - soft delete check', async () => {
    const firstPlaceSeed = await placeSeedHelper.seed({});
    const secondPlaceSeed = await placeSeedHelper.seed({});

    // 삭제된 picked place 생성
    await pickedPlaceSeedHelper.seed({
      placeIdx: firstPlaceSeed.idx,
      deletedAt: new Date(),
    });

    const pickedPlaceToKeep = await pickedPlaceSeedHelper.seed({
      placeIdx: secondPlaceSeed.idx,
    });

    const response = await testHelper
      .test()
      .get('/picked-place/all')
      .query({ page: 1 })
      .expect(200);

    const { pickedPlaceOverviewList }: GetAllPickedPlaceOverviewResponseDto =
      response.body;

    expect(pickedPlaceOverviewList[0].idx).toBe(pickedPlaceToKeep.idx);
  });

  it('400 - page is missing', async () => {
    await testHelper.test().get('/picked-place/all').expect(400);
  });

  it('400 - invalid page', async () => {
    await testHelper
      .test()
      .get('/picked-place/all')
      .query({ page: -1 })
      .expect(400);
  });
});
