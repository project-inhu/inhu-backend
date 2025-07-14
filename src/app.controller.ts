import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import { Request, Response } from 'express';
import { AuthGuard } from './auth/common/guards/auth.guard';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/test')
  @ApiExcludeEndpoint()
  test(@Req() req: Request, @Res() res: Response) {
    const filePath = path.join(
      '/home/ubuntu/inhu-backend/public',
      'testKakao.html',
    );
    return res.sendFile(filePath);
  }
}
