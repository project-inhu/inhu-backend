import { Module } from '@nestjs/common';
import { PlaceCronModule } from './place-cron/place-cron.module';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { PrismaModule } from '@libs/common/modules/prisma/prisma.module';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { DiscordWebhookModule } from '@libs/common/modules/discord-webhook/discord-webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PlaceCronModule,
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
  ],
})
export class BatchServerModule {}
