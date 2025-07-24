import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { RedisService } from '@libs/common/modules/redis/redis.service';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { PrismaTestSetup } from '@libs/testing/setup/prisma-test.setup';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as uuid from 'uuid';
import { DateUtilService, Type } from '@libs/common';
import { DateUtil } from '@libs/testing';

interface OverrideBy {
  useValue: (value: any) => ITestHelper;
}

export abstract class ITestHelper {
  protected app: INestApplication;
  protected appModule: TestingModule;
  private readonly overrideProviderMap: Map<any, any> = new Map();
  private readonly prismaSetup = PrismaTestSetup.setup();
  private readonly RootModule: Type;

  /**
   * init 메서드가 호출된 이후, 각 it에서 활용할 수 있는 고유한 test id입니다.
   * 반드시, init 메서드가 호출된 이후에 사용해야 합니다.
   */
  protected test_id: string | null;

  constructor(AppModule: Type) {
    this.RootModule = AppModule;
  }

  public async init() {
    await this.prismaSetup.BEGIN();
    this.test_id = uuid.v4();

    const testingModuleBuilder = Test.createTestingModule({
      imports: [this.RootModule],
    });

    for (const mapKey of this.overrideProviderMap.keys()) {
      testingModuleBuilder
        .overrideProvider(mapKey)
        .useValue(this.overrideProviderMap.get(mapKey));
    }

    testingModuleBuilder
      .overrideProvider(PrismaService)
      .useValue(this.prismaSetup.getPrisma());

    testingModuleBuilder
      .overrideProvider('REDIS_PREFIX')
      .useValue(this.test_id);

    this.appModule = await testingModuleBuilder.compile();
    this.app = this.appModule.createNestApplication();

    await this.appSetup();

    await this.app.init();
  }

  /**
   * app 마다 필요한 초기 설정 구현체
   *
   * !주의: 외부에서 사용하지 마십시오
   */
  abstract appSetup(): Promise<void>;

  public getPrisma(): PrismaService {
    return this.prismaSetup.getPrisma();
  }

  public seedHelper<T extends ISeedHelper>(SeedHelper: Type<T>): T {
    return new SeedHelper(this.getPrisma());
  }

  public async destroy() {
    await this.delRedisKeys();
    this.prismaSetup.ROLLBACK();
    await this.appModule.close();
    await this.app.close();
    this.test_id = null;
  }

  private async delRedisKeys() {
    try {
      const redisService = this.app.get(RedisService);

      if (!redisService) {
        return;
      }

      // keys 메서드는 prefix를 고려하지 않습니다.
      // 그러나, del 메서드는 prefix를 고려하기 때문에 조회된 key에서 prefix를 제거해야합니다.
      const keys = await redisService.keys(`${this.test_id}:*`);
      await redisService.del(
        keys.map((key) => key.replace(`${this.test_id}:`, '')),
      );
    } catch (err) {}
  }

  public get<T = any>(type: Type<T>): T {
    return this.app.get<T>(type);
  }

  public overrideProvider<T = any>(provider: T): OverrideBy {
    const addProvider = (value: any) => {
      this.addProviderToMap(provider, value);
      return this;
    };

    return {
      useValue: (value) => addProvider(value),
    };
  }

  private addProviderToMap(key: any, value: any) {
    this.overrideProviderMap.set(key, value);
  }

  public getServer() {
    return this.app.getHttpServer();
  }

  public test() {
    return request(this.getServer());
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
