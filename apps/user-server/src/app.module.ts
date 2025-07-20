import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    PrismaModule,
    PlaceModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ReviewModule,
    PickedPlaceModule,
    AuthModule,
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
export class AppModule {}
