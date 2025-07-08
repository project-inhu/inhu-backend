import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';
import { PickedPlaceSelectField } from './type/picked-place-select-field';

@Injectable()
export class PickedPlaceRepository {
  constructor(private prisma: PrismaService) {}

  async selectAllPickedPlace(
    page: number,
    userIdx?: number,
  ): Promise<PickedPlaceSelectField[]> {
    return await this.prisma.pickedPlace.findMany({
      skip: (page - 1) * 10,
      take: 10,
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        title: true,
        content: true,
        place: {
          select: {
            idx: true,
            name: true,
            address: true,
            reviewCount: true,
            bookmarkList: userIdx
              ? {
                  where: { userIdx },
                  select: { placeIdx: true },
                }
              : undefined,
            placeImageList: {
              select: {
                path: true,
              },
            },
          },
        },
      },
    });
  }
}
