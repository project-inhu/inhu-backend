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
import { CreatePickedPlaceInput } from '@app/core/picked-place/inputs/create-picked-place.input';
import { UpdatePickedPlaceInput } from '@app/core/picked-place/inputs/update-picked-place.input';

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
      where: {
        idx,
        deletedAt: null,
        place: {
          deletedAt: null,
        },
      },
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

  public async insertPickedPlace(
    placeIdx: number,
    input: CreatePickedPlaceInput,
  ): Promise<SelectPickedPlace> {
    return await this.txHost.tx.pickedPlace.create({
      ...SELECT_PICKED_PLACE,
      data: {
        title: input.title,
        content: input.content,
        placeIdx,
      },
    });
  }

  /**
   * @param idx placeIdx가 아닙니다. picked_place의 idx입니다.
   */
  public async updatePickedPlaceByIdx(
    idx: number,
    input: UpdatePickedPlaceInput,
  ): Promise<void> {
    await this.txHost.tx.pickedPlace.update({
      data: {
        title: input.title,
        content: input.content,
      },
      where: { idx, deletedAt: null, place: { deletedAt: null } },
    });
  }

  /**
   * @param idx placeIdx가 아닙니다. picked_place의 idx입니다.
   */
  public async deletePickedPlaceByIdx(idx: number): Promise<void> {
    await this.txHost.tx.pickedPlace.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        idx,
        deletedAt: null,
        place: {
          deletedAt: null,
        },
      },
    });
  }
}
