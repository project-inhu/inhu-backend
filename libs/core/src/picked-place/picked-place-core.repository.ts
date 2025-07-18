import {
  SELECT_PICKED_PLACE_OVERVIEW,
  SelectPickedPlaceOverview,
} from './model/prisma-type/select-picked-place-overview';
import { GetPickedPlaceAllInput } from './inputs/get-picked-place-all.input';
import {
  SELECT_PICKED_PLACE,
  SelectPickedPlace,
} from './model/prisma-type/select-picked-place';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PickedPlaceCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectPickedPlaceByIdx(
    idx: number,
  ): Promise<SelectPickedPlace | null> {
    return await this.txHost.tx.pickedPlace.findUnique({
      ...SELECT_PICKED_PLACE,
      where: { idx, deletedAt: null },
    });
  }

  public async selectPickedPlaceAll({}: GetPickedPlaceAllInput): Promise<
    SelectPickedPlaceOverview[]
  > {
    return await this.txHost.tx.pickedPlace.findMany({
      ...SELECT_PICKED_PLACE_OVERVIEW,
      where: {
        deletedAt: null,
        place: {
          deletedAt: null,
        },
      },
      orderBy: {
        createdAt: 'desc', // TODO: 인덱싱 필요
      },
    });
  }
}
