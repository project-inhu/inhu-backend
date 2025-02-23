import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { GetAllPlaceOverviewDto } from './dto/get-all-place-overview.dto';

@Injectable()
export class PlaceRepository {
  constructor(private prisma: PrismaService) {}

  async selectAllPlaceOverview(
    getAllPlaceOverviewDto: GetAllPlaceOverviewDto,
  ): Promise<PlaceOverviewQueryResult[]> {
    const { page, userIdx } = getAllPlaceOverviewDto;

    // keyword를 제외한 place 정보 읽어오기
    return await this.prisma.place.findMany({
      skip: page - 1,
      take: 10,
      where: {
        deletedAt: null,
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
          },
        },
        placeImage: {
          select: {
            imagePath: true,
          },
        },
        review: {
          select: {
            idx: true,
          },
        },
      },
    });
  }
}
