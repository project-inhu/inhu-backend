import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { SELECT_OWNED_PLACE } from './model/prisma-type/select-owned-place';
import { SelectOwnedPlaceOverview } from './model/prisma-type/select-owned-place-overview';
import { GetOwnerPlaceOverviewInput } from './inputs/get-owner-place-overview.input';

@Injectable()
export class OwnedPlaceCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async selectOwnerPlaceOverviewAllByUserIdx(
    input: GetOwnerPlaceOverviewInput,
    userIdx: number,
  ): Promise<SelectOwnedPlaceOverview[]> {
    return await this.txHost.tx.place.findMany({
      ...SELECT_OWNED_PLACE,
      where: {
        AND: [{ deletedAt: null }, { placeOwnerList: { some: { userIdx } } }],
      },
      orderBy: { idx: 'asc' },
      take: input.take,
      skip: input.skip,
    });
  }
}
