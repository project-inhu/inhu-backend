import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@user/app.module';
import { AuthGuard } from '@user/auth/common/guards/auth.guard';
import { PrismaService } from '@libs/common/modules/prisma/prisma.service';

/**
 * E2E 테스트를 위한 NestJS 애플리케이션을 생성 및 관리하는 클래스.
 *
 * @author 이수인
 */
export class TestManager {
  private app: INestApplication;
  private prisma: PrismaService;
  private prismaTestingHelper: PrismaTestingHelper<PrismaService> | undefined;
  private currentUserIdx: number = 1;

  static create() {
    return new TestManager();
  }

  async init() {
    if (!this.prismaTestingHelper) {
      this.prismaTestingHelper = new PrismaTestingHelper(new PrismaService());
      this.prisma = this.prismaTestingHelper.getProxyClient();
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(this.prisma)
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { idx: this.currentUserIdx };
          return true;
        },
      })
      .compile();

    this.app = moduleFixture.createNestApplication();

    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await this.app.init();
  }

  async close() {
    await this.app.close();
  }

  async startTransaction() {
    await this.prismaTestingHelper?.startNewTransaction();
  }

  rollbackTransaction() {
    this.prismaTestingHelper?.rollbackCurrentTransaction();
  }

  setUserIdx(userIdx: number) {
    this.currentUserIdx = userIdx;
  }

  getApp() {
    return this.app;
  }
}
