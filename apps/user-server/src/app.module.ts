import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from '../../../libs/common/src/modules/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';
import { ConfigModule } from '@nestjs/config';
import { ReviewModule } from './api/review/review.module';
import { PickedPlaceModule } from './api/picked-place/picked-place.module';
import { ClsModule } from 'nestjs-cls';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { AuthModule } from '@user/api/auth/auth.module';
import { LoginTokenModule } from '@user/common/module/login-token/login-token.module';
import { AccessTokenMiddleware } from '@user/common/middleware/access-token.middleware';
import { UserModule } from './api/user/user.module';
import { MenuModule } from '@user/api/menu/menu.module';
import { S3UploadModule } from './api/s3-upload/s3-upload.module';
import { BookmarkModule } from './api/bookmark/bookmark.module';
import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';
import { RedlockModule } from '@libs/common/modules/redlock/redlock.module';
import { AopModule } from '@toss/nestjs-aop';
import { BlogReviewModule } from '@user/api/blog-review/blog-review.module';

@Module({
  imports: [
    PrismaModule,
    PlaceModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ReviewModule,
    PickedPlaceModule,
    AuthModule,
    LoginTokenModule,
    MenuModule,
    S3UploadModule,
    BookmarkModule,
    DiscordWebhookModule,
    RedlockModule,
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
    BlogReviewModule,
    AopModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(AccessTokenMiddleware).forRoutes('/');
  }
}
