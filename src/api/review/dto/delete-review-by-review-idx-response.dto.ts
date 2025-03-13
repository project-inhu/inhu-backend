import { ApiProperty } from '@nestjs/swagger';
import { Review } from '@prisma/client';

export class DeleteReviewByReviewIdxResponseDto {
  @ApiProperty({ description: 'review idx', example: 1 })
  idx: number;

  @ApiProperty({ description: 'review 작성자 idx', example: 1 })
  userIdx: number;

  @ApiProperty({ description: 'review 등록한 place idx', example: 1 })
  placeIdx: number;

  @ApiProperty({ description: 'review content', example: '맛이 최고네요.' })
  content: string;

  @ApiProperty({
    description: 'review 생성 날짜',
    example: '2025-02-26T11:38:19.491Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'review 삭제 날짜',
    example: '2025-03-12T12:35:33.396Z',
    nullable: true,
  })
  deletedAt: Date | null;

  constructor(review: Review) {
    this.idx = review.idx;
    this.userIdx = review.userIdx;
    this.placeIdx = review.placeIdx;
    this.content = review.content;
    this.createdAt = review.createdAt;
    this.deletedAt = review.deletedAt;
  }
}
