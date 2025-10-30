import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import openAIConfig from './config/openAI.config';
import { OpenAIService } from './openAI.service';

@Module({
  imports: [ConfigModule.forFeature(openAIConfig)],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
