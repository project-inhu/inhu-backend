import { Type } from '@libs/common';
import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { PrismaTestSetup } from '@libs/testing/setup/prisma-test.setup';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

interface OverrideBy {
  useValue: (value: any) => ITestHelper;
}

export abstract class ITestHelper {
  protected app: INestApplication;
  protected appModule: TestingModule;
  protected readonly overrideProviderMap: Map<any, any> = new Map();
  protected readonly prismaSetup = PrismaTestSetup.setup();
  private readonly RootModule: Type;

  constructor(AppModule: Type) {
    this.RootModule = AppModule;
  }

  public async init() {
    await this.prismaSetup.BEGIN();

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
    this.prismaSetup.ROLLBACK();
    await this.appModule.close();
    await this.app.close();
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
}
