import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

/**
 * E2E 테스트를 위한 NestJS 애플리케이션을 생성 및 관리하는 클래스.
 *
 * @author 이수인
 */
export class TestManager {
  private app: INestApplication;
  private prisma: PrismaService;
  private prismaTestingHelper: PrismaTestingHelper<PrismaService> | undefined;

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
          req.user = { idx: 1 };
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

    await this.prismaTestingHelper.startNewTransaction();

    await this.app.init();
  }

  async close() {
    this.prismaTestingHelper?.rollbackCurrentTransaction();
    await this.app.close();
  }

  getApp() {
    return this.app;
  }
}
