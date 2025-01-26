import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/module/prisma/prisma.service";
import { AllPlaceResponseDto, GetAllPlaceDto, Place } from "./place.dto";

@Injectable()
export class PlaceRepository {
	constructor(private prisma: PrismaService) { }

	async getAllPlace(getAllPlaceDto: GetAllPlaceDto): Promise<AllPlaceResponseDto> {
		const { page, userIdx } = getAllPlaceDto;

		// keyword를 제외한 place 정보 읽어오기
		const placeQueryList = await this.prisma.place.findMany({
			skip: page - 1,
			take: 10,
			where: {
				deletedAt: null
			},
			select: {
				idx: true,
				name: true,
				address: true,
				bookmark: {
					where: {
						userIdx: userIdx,
					},
					select: {
						idx: true,
					}
				},
				placeImage: {
					select: {
						imagePath: true,
					}
				},
				review: {
					select: {
						idx: true,
					}
				}
			}
		})

		// keyword 정보 읽어오기
		const keywordQueryList = await this.prisma.keyword.findMany({
			where: {
				deletedAt: null
			},
			select: {
				idx: true,
				content: true,
			}
		})

		// { placeIdx: x, keywordIdx: x, keywordCount: x } 형식으로 그룹화해서 읽어오기.
		const keywordCountQueryList: any[] = await this.prisma.$queryRaw`
      		SELECT
        		p.idx AS "placeIdx",
        		rkm.keyword_idx AS "keywordIdx",
        		COUNT(*) AS "keywordCount"
      		FROM
      		  	place_tb p
      		JOIN
				review_tb r
			ON p.idx = r.place_idx
      		JOIN
				review_keyword_mapping_tb rkm
				ON r.idx = rkm.review_idx
      		WHERE
      		  	p.deleted_at IS NULL
      		GROUP BY
      		  	p.idx, rkm.keyword_idx
      		ORDER BY
				"keywordCount" DESC;
		`

		// place를 반환하기 위해 1차 가공
		const placeList: Place[] = placeQueryList.map((place) => ({
			idx: place.idx,
			name: place.name,
			address: place.address,
			reviewCount: place.review.length,
			bookmark: place.bookmark.length > 0 ? true : false,
			keyword: [] as string[],
			imagePath: place.placeImage.map((path) => path.imagePath)
		}))

		// place 마다 가장 많이 선택된 keyword 2개 골라서 placeList.keyword에 push 해주기
		let placeIdx: number = 0;
		let count: number = 0;
		keywordCountQueryList.forEach((elem) => {
			if (elem.placeIdx != placeIdx) {
				placeIdx = elem.placeIdx;
				count = 0;
			}

			if (count != 2) {
				const foundKeywordObj = keywordQueryList.find(obj => obj.idx === elem.keywordIdx);
				const targetObj2 = placeList.find(obj => obj.idx === elem.placeIdx);

				targetObj2.keyword.push(foundKeywordObj.content);
				count++;
			}
		});

		const responseData: AllPlaceResponseDto = {
			placeList: placeList
		}

		return responseData;
	}
}