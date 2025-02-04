import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/module/prisma/prisma.service";
import { GetReviewsByPlaceIdDto } from "./review.dto";

@Injectable()
export class ReviewRepository {
    constructor(private prisma: PrismaService) { }

    async getReviewsByPlaceId(getReviewsByPlaceIdDto: GetReviewsByPlaceIdDto) {
        return await this.prisma.review.findMany({
            where: {
                placeIdx: getReviewsByPlaceIdDto.placeIdx,
                deletedAt: null
            },
            select: {
                idx: true,
                userIdx: true,
                placeIdx: true,
                content: true,
                createdAt: true,
                reviewImage: {
                    select: { imagePath: true }
                },
                reviewKeywordMapping: {
                    select: {
                        keyword: {
                            select: {
                                content: true
                            }
                        }
                    }
                }
            }
        })
    }
}
