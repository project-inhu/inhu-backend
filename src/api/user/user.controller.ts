import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetMyInfoResponseDto } from './dto/user-info.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { };

    // * 내 정보 보기 (프로필, 닉네임)
    @Get()
    // TODO : authguard 추가 / auth 폴더에서 토큰 발급 api 추가
    async getMyInfo(@Req() req: any): Promise<GetMyInfoResponseDto> {
        const { idx } = req.user;
        return this.userService.getMyInfo(idx);
    }
}
