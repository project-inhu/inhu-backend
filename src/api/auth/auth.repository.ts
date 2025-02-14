import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { UserDto, UserProviderDto } from './dto/auth.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

    // userProdiver에서 해당 user가 존재하는지 조회
    async findUser(snsId: string, provider: number): Promise<UserProviderDto | null> {
    return this.prisma.userProvider.findFirst({
        where: { snsId, provider },
        });
    }

    // (존재하지 않는다면) user table에 create
    async createUser(nickname: string): Promise<UserDto> {
    return this.prisma.user.create({
            data: { nickname },
            select: { idx: true, nickname: true },
        });
    }

    // (존재하지 않는다면) userProvider table에 create
    async createUserProvider(snsId: string, provider: number, userIdx: number): Promise<UserProviderDto> {
    return this.prisma.userProvider.create({
      data: { snsId, provider, idx: userIdx },
      select: { idx: true, snsId: true, provider: true },
    });
  }

    // 특정 유저의 refresh token 업데이트 (재발급)
    // TODO: update문에 return 넣을지 (통일성 유지)
    async updateRefreshToken(userIdx: number, refreshToken: string): Promise<void> {
    await this.prisma.user.update({
        where: { idx: userIdx },
        data: { refreshToken }, // refreshToken 컬럼 업데이트
    });
    } 
    
    // 특정 유저의 refreshToken 가져오기 (비교해서 검증 위함)
    async getRefreshToken(userIdx: number): Promise<string | null> {
        const user = await this.prisma.user.findUnique({
            where: { idx: userIdx },
            select: { refreshToken: true },
        });
    return user?.refreshToken || null;
  }
}
