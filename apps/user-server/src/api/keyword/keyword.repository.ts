import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/module/prisma/prisma.service";

@Injectable()
export class KeywordRepository {
    constructor(private prisma: PrismaService) { }

    async getAllKeywordCountByPlace() {
        // { placeIdx: x, keywordIdx: x, keywordCount: x } 형식으로 그룹화해서 읽어오기.
        return await this.prisma.$queryRaw<any[]>`
            SELECT
                p.idx AS "placeIdx",
                rkm.keyword_idx AS "keywordIdx",
                COUNT(*) AS "keywordCount"
            FROM
                place_tb p
            JOIN
                review_tb r
            ON
                p.idx = r.place_idx
            JOIN
                review_keyword_mapping_tb rkm
            ON
                r.idx = rkm.review_idx
            WHERE
                p.deleted_at IS NULL
            GROUP BY
                p.idx, rkm.keyword_idx
            ORDER BY
                "keywordCount" DESC;
        `
    }

    async getAllKeyword() {
        // keyword 정보 읽어오기
        return await this.prisma.keyword.findMany({
            where: {
                deletedAt: null
            },
            select: {
                idx: true,
                content: true,
            }
        })
    }
}