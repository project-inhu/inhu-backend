import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { HeejuAuthService } from './heeju_auth.service';
import { AuthGuard } from './heeju_auth.guard';
import { Request } from 'express';
type RequestWithUser = Request & { user?: { idx: number } };

@Controller('heeju-auth')
export class HeejuAuthController {
    constructor(private readonly heejuAuthService: HeejuAuthService) { }
    
    @Get('kakao/callback')
    async loginWithKakao(@Query('code') code: string) {
        if (!code) {
            throw new BadRequestException('코드가 존재하지 않음');
        }

        try {
            const { accessToken } = await this.heejuAuthService.loginWithKakao(code);
            return {
                message: "로그인 성공",
                accessToken
            }
        } catch (error) {
            console.error('로그인 에러:', error.response?.data || error.message || error);
            throw new BadRequestException('로그인 실패');
        }
    }

    @Get('test')
    @UseGuards(AuthGuard)
    async testAuth(@Req() req : RequestWithUser) {
        return {
            message: "test",
            userIdx : req.user?.idx
        }
    }

}
