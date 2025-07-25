import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/module/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KeywordModule } from './api/keyword/keyword.module';
import { ReviewModule } from './api/review/review.module';
import { S3Module } from './common/module/s3/s3.module';
import { PickedPlaceModule } from './api/picked-place/picked-place.module';
import { ClsModule } from 'nestjs-cls';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@user/common/module/prisma/prisma.service';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';

@Module({
  imports: [
    PrismaModule,
    PlaceModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ReviewModule,
    S3Module,
    PickedPlaceModule,
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
