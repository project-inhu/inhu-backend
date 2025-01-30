import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsString, Min, ValidateNested } from "class-validator";

export class GetAllPlaceDto {
    @ApiProperty({ description: 'page number', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number;

    @ApiProperty({ description: 'userIdx number', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    userIdx: number;
}

export class PlaceEntity {
    @ApiProperty({ description: 'place idx', example: 1 })
    @IsInt()
    @Min(1)
    idx: number;

    @ApiProperty({ description: 'place name', example: '동아리 닭갈비' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'place address', example: '인천 미추홀구' })
    @IsString()
    address: string;

    @ApiProperty({ description: 'review count', example: 1 })
    @IsInt()
    @Min(0)
    reviewCount: number;

    @ApiProperty({ description: '현재 사용자가 특정 항목을 북마크했는지 여부', example: true })
    @IsBoolean()
    bookmark: boolean;

    @ApiProperty({ description: '특정 장소에서 가장 많이 사용된 review keyword 상위 2개', example: ['맛있어요.', '가성비 좋아요.'] })
    @IsArray()
    @IsString({ each: true })
    keyword: string[];

    @ApiProperty({ description: '특정 장소 사진 path list', example: ['1234'] })
    @IsArray()
    @IsString({ each: true })
    imagePath: string[];
}

export class AllPlaceResponseDto {
    @ApiProperty({ description: '모든 place entity list' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PlaceEntity)
    placeList: PlaceEntity[];
}
