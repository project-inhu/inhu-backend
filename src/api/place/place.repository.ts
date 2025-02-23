import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { GetAllPlaceOverviewDto } from './dto/get-all-place-overview.dto';
import { GetPlaceByPlaceIdxDto } from './dto/get-place-detail.dto';
import { PlaceQueryResult } from './interfaces/place-query-result.interface';

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
            userIdx,
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

  async selectPlaceByPlaceIdx(
    getPlaceByPlaceIdxDto: GetPlaceByPlaceIdxDto,
  ): Promise<PlaceQueryResult | null> {
    const { idx } = getPlaceByPlaceIdxDto;
    const userIdx = 1;

    return await this.prisma.place.findFirst({
      where: {
        idx,
        deletedAt: null,
      },
      select: {
        idx: true,
        name: true,
        tel: true,
        address: true,
        addressX: true,
        addressY: true,
        createdAt: true,
        placeHours: {
          select: {
            day: true,
            startAt: true,
            endAt: true,
          },
        },
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
