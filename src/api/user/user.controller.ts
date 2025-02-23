import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetMyInfoResponseDto, UpdateMyInfoDto } from './dto/user-info.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';

type RequestWithUser = Request & { user?: { idx: number } };

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getMyInfo(@Req() req): Promise<any> {
    const userIdx = req.user.idx;
    return await this.userService.getMyInfo(userIdx);
  }
}
