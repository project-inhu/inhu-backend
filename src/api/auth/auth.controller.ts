import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';
import { Public } from './decorators/public.decorator';
type RequestWithUser = Request & { user?: { idx: number } };

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) { }
    
    @Public()
    @Get('kakao/callback')
    async loginWithKakao(@Query('code') code: string) {
        if (!code) {
            throw new BadRequestException('코드가 존재하지 않음');
        }

        try {
            const { accessToken } = await this.AuthService.loginWithKakao(code);
            return {
                message: "로그인 성공",
                accessToken
            }
        } catch (error) {
            console.error('로그인 에러:', error.response?.data || error.message || error);
            throw new BadRequestException('로그인 실패');
        }
    }

    // test
    @Get('test')
    //@UseGuards(AuthGuard) -> Global guard로 설정했기 때문에 생략해도 됨
    async testAuth(@Req() req : RequestWithUser) {
        return {
            message: "test",
            userIdx : req.user?.idx
        }
    }

}
