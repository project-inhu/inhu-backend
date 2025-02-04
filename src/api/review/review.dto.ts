import { Type } from "class-transformer";
import { IsArray, IsInt, IsString, Min, ValidateNested } from "class-validator";

// 내가 쓴 리뷰 볼 때, 가게 이름은 안 나오나?
export class ReviewEntity {
    @IsInt()
    @Type(() => Number)
    idx: number;

    @IsInt()
    @Min(1)
    userIdx: number;

    @IsInt()
    placeIdx: number;

    @IsString()
    content: string;

    @IsString()
    createdAt: string;

    @IsArray()
    @IsString({ each: true })
    reviewImages: string[];

    @IsArray()
    @IsString({ each: true })
    reviewKeywords: string[];
}

export class GetReviewsByPlaceIdDto {
    @IsInt()
    placeIdx: number;
}

export class ReviewsByPlaceIdResponseDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReviewEntity)
    reviews: ReviewEntity[];
}