import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetMyInfoResponseDto, UpdateMyInfoDto } from './dto/user-info.dto';
import { Request } from 'express';

type RequestWithUser = Request & { user?: { idx: number } };

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { };

    // * 내 정보 보기 (프로필, 닉네임)
    @Get()
    // TODO : authguard 추가(passport X) / auth 폴더에 토큰 발급 api 추가
    async getMyInfo(@Req() req: RequestWithUser): Promise<GetMyInfoResponseDto> {
        const { idx } = req.user;

        return this.userService.getMyInfo(idx);
    }

    // * 내 정보 수정하기 (프로필, 닉네임)
    @Patch()
    // TODO : authguard 추가(passport X) / auth 폴더에 토큰 발급 api 추가
    async updateMyInfo(@Req() req: any, @Body() UpdateMyInfoDto: UpdateMyInfoDto): Promise<GetMyInfoResponseDto> {
        const { idx } = req.user;
        return this.userService.updateMyInfo(idx, UpdateMyInfoDto);
    }
}