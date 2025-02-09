import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/module/prisma/prisma.module';
import { PlaceModule } from './api/place/place.module';
import { ReviewModule } from './api/review/review.module';
import { AuthModule } from './api/gongsil_auth/auth_module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    PrismaModule,
    PlaceModule,
    ReviewModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
