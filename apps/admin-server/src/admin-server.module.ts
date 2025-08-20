import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { AdminAccessTokenMiddleware } from './common/middleware/admin-access-token.middleware';
import { PrismaModule } from '@libs/common/modules/prisma/prisma.module';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { LoginTokenModule } from './common/modules/login-token/login-token.module';
import { PlaceModule } from '@admin/api/place/place.module';
import { UserModule } from '@admin/api/user/user.module';
import { MenuModule } from './api/menu/menu.module';
import { ReviewModule } from './api/review/review.module';
import { S3UploadModule } from '@admin/api/s3-upload/s3-upload.module';
import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    AuthModule,
    LoginTokenModule,

    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      defaultLabels: { service: 'admin-server' },
    }),

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
    DiscordWebhookModule,
    PlaceModule,
    UserModule,
    MenuModule,
    ReviewModule,
    S3UploadModule,
  ],
})
export class AdminServerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(AdminAccessTokenMiddleware).forRoutes('/');
  }
}
