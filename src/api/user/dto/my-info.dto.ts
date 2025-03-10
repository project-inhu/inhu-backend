/**
 * 내 정보 DTO
 *
 * @author 조희주
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MyInfoDto {
  @ApiProperty({ description: '사용자 닉네임', example: 'heeju' })
  @IsString()
  nickname?: string;

  @ApiProperty({
    description: '프로필 이미지 경로',
    example: 'https://inhu.s3.ap-northeast-2.amazonaws.com/user123/profile.jpg',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  profileImagePath?: string | null;
}
