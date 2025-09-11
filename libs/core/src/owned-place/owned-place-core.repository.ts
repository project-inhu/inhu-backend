import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_OWNED_PLACE,
  SelectOwnedPlace,
} from './model/prisma-type/select-owned-place';

@Injectable()
export class OwnedPlaceCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectOwnerPlaceAllByUserIdx(
    userIdx: number,
  ): Promise<SelectOwnedPlace[]> {
    return await this.txHost.tx.place.findMany({
      ...SELECT_OWNED_PLACE,
      where: {
        AND: [{ deletedAt: null }, { placeOwnerList: { some: { userIdx } } }],
      },
      orderBy: { idx: 'asc' },
    });
  }
}
