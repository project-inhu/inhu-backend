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

    // 존재하지 않는다면 user table에 create
    async createUser(nickname: string): Promise<UserDto> {
    return this.prisma.user.create({
            data: { nickname },
            select: { idx: true, nickname: true },
        });
    }

  // 존재하지 않는다면 userProvider table에 create
  async createUserProvider(snsId: string, provider: number, userIdx: number): Promise<UserProviderDto> {
    return this.prisma.userProvider.create({
      data: { snsId, provider, idx: userIdx },
      select: { idx: true, snsId: true, provider: true },
    });
  }
}
