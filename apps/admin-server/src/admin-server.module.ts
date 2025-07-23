import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { AdminAccessTokenMiddleware } from './common/middleware/access-token.middleware';
import { PrismaModule } from '@libs/common/modules/prisma/prisma.module';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { LoginTokenModule } from './common/modules/login-token/login-token.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    LoginTokenModule,
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
            sqlFlavor: 'postgresql',
          }),
        }),
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AdminServerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(AdminAccessTokenMiddleware).forRoutes('/');
  }
}
