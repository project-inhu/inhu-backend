import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { GetMyInfoResponseDto, UpdateMyInfoDto } from './dto/user-info.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  // * 내 정보 보기 (마이페이지 - 프로필, 닉네임)
  // Q. 그러면 로그인할때 닉네임 정해지는거임? OK
  async getMyInfo(idx: number): Promise<GetMyInfoResponseDto> {
    // 토큰에서 내 idx값 가져와서 그 idx에 해당하는 프로필, 닉네임 가져오기
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { idx },
      select: {
        nickname: true,
        profileImagePath: true,
      },
    });

    return user;
  }

  // * 내 정보 수정하기 (마이페이지 - 프로필, 닉네임)
  // Q. update문에 return을 줄 필요가 있는가? OK
  // Q. GetMyInfoResponseDto
  // TODO : 유효성 검사 (닉네임 중복 검사)
  async updateMyInfo(
    idx: number,
    updateData: UpdateMyInfoDto,
  ): Promise<GetMyInfoResponseDto> {
    const updatedUser = await this.prisma.user.update({
      where: { idx },
      data: {
        nickname: updateData.nickname,
        profileImagePath: updateData.profileImagePath,
      },
    });

    return updatedUser;
  }

  // * 회원 탈퇴
}
