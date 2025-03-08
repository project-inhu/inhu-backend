import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { GetAllPlaceOverviewDto } from './dto/get-all-place-overview.dto';
import { PlaceQueryResult } from './interfaces/place-query-result.interface';
import { Place } from '@prisma/client';
import { CreatePlaceDto } from './dto/create-place.dto';

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

  async selectPlaceByIdx(
    idx: number,
    userIdx?: number,
  ): Promise<PlaceQueryResult | null> {
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
          where: userIdx ? { userIdx } : undefined,
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

  async createPlace(createPlaceDto: CreatePlaceDto): Promise<Place> {
    return await this.prisma.place.create({
      data: {
        name: createPlaceDto.name,
        tel: createPlaceDto.tel,
        address: createPlaceDto.address,
        addressX: createPlaceDto.addressX,
        addressY: createPlaceDto.addressY,
        placeHours: {
          createMany: {
            data: Object.entries(createPlaceDto.week).map(
              ([weekDay, schedule]) => ({
                day: weekDay,
                startAt: schedule?.startAt ?? null,
                endAt: schedule?.endAt ?? null,
              }),
            ),
          },
        },
        placeImage: {
          createMany: {
            data: createPlaceDto.placeImageList.map((imagePath) => ({
              imagePath,
            })),
          },
        },
      },
    });
  }

  async updatePlaceImageByPlaceIdx(placeImageList: string[], placeIdx: number) {
    return this.prisma.place.update({
      where: { idx: placeIdx },
      data: {
        placeImage: {
          createMany: {
            data: placeImageList.map((imagePath) => ({
              imagePath,
            })),
          },
        },
      },
    });
  }

  async deletePlaceImageByPlaceIdx(placeIdx: number) {
    return this.prisma.place.update({
      where: {
        idx: placeIdx,
      },
      data: {
        placeImage: {
          deleteMany: {},
        },
      },
    });
  }

  async uploadPlaceImageByPlaceIdx(
    placeImageList: string[],
    placeIdx: number,
  ): Promise<void> {
    return this.prisma.$transaction(async () => {
      this.deletePlaceImageByPlaceIdx(placeIdx);
      this.updatePlaceImageByPlaceIdx(placeImageList, placeIdx);
    });
  }
}
