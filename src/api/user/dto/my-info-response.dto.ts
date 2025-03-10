/**
 * 내 정보 응답 DTO
 *
 * @author 조희주
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class MyInfoResponseDto {
  @ApiProperty({ description: '사용자 고유 idx', example: 1 })
  @IsInt()
  idx: number;

  @ApiProperty({ description: '사용자 닉네임', example: 'heeju' })
  @IsString()
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지 경로',
    example: 'https://inhu.s3.ap-northeast-2.amazonaws.com/user123/profile.jpg',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  profileImagePath: string | null;

  @ApiProperty({
    description: '계정 생성일',
    example: '2025-03-07T08:50:21.451Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: '계정 삭제일 (삭제되지 않은 경우 null)',
    example: '2025-03-10T08:50:21.451Z',
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;
}
