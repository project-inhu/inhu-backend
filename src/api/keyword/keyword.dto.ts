import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class KeywordEntity {
    @ApiProperty({ description: 'place idx', example: 1 })
    @IsInt()
    @Min(1)
    placeIdx: number;

    @ApiProperty({ description: 'keyword idx', example: 1 })
    @IsInt()
    @Min(1)
    keywordIdx: number;

    @ApiProperty({ description: '특정 장소에서 특정 keyword가 사용된 개수', example: 1 })
    @IsInt()
    @Min(0)
    keywordCount: number;
}