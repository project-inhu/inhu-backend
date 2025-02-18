import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/module/prisma/prisma.service";
import { GetAllPlaceDto } from "./place.dto";

@Injectable()
export class PlaceRepository {
	constructor(private prisma: PrismaService) { }

	async getAllPlace(getAllPlaceDto: GetAllPlaceDto) {
		const { page, userIdx } = getAllPlaceDto;

		// keyword를 제외한 place 정보 읽어오기
		return await this.prisma.place.findMany({
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
	}
}