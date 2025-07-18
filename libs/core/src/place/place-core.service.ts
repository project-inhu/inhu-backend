import { UpdatePlaceInput } from './inputs/update-place.input';
import { CreatePlaceInput } from './inputs/create-place.input';
import { GetPlaceOverviewInput } from './inputs/get-place-overview.input';
import { PlaceOverviewModel } from './model/place-overview.model';
import { PlaceModel } from './model/place.model';
import { PlaceCoreRepository } from './place-core.repository';
import { Injectable } from '@nestjs/common';
import { BookmarkedPlaceOverviewModel } from './model/bookmarked-place-overview.model';
import { GetBookmarkedPlaceOverviewInput } from './inputs/get-bookmarked-place-overview.input';

@Injectable()
export class PlaceCoreService {
  constructor(private readonly placeCoreRepository: PlaceCoreRepository) {}

  public async getPlaceByIdx(idx: number): Promise<PlaceModel | null> {
    const place = await this.placeCoreRepository.selectPlaceByIdx(idx);
    return place && PlaceModel.fromPrisma(place);
  }

  public async getBookmarkedPlace(
    input: GetBookmarkedPlaceOverviewInput,
  ): Promise<BookmarkedPlaceOverviewModel[]> {
    return await this.placeCoreRepository
      .selectBookmarkedPlaceAll(input)
      .then((result) => result.map(BookmarkedPlaceOverviewModel.fromPrisma));
  }

  public async getPlaceAll(
    input: GetPlaceOverviewInput,
  ): Promise<PlaceOverviewModel[]> {
    return (await this.placeCoreRepository.selectPlaceAll(input)).map(
      PlaceOverviewModel.fromPrisma,
    );
  }

  public async createPlace(input: CreatePlaceInput): Promise<PlaceModel> {
    return PlaceModel.fromPrisma(
      await this.placeCoreRepository.insertPlace(input),
    );
  }

  public async updatePlaceByIdx(
    idx: number,
    input: UpdatePlaceInput,
  ): Promise<void> {
    return await this.placeCoreRepository.updatePlaceByIdx(idx, input);
  }

  public async deletePlaceByIdx(idx: number): Promise<void> {
    return await this.placeCoreRepository.softDeletePlaceByIdx(idx);
  }

  public async increasePlaceReviewCount(idx: number): Promise<void> {
    return await this.placeCoreRepository.increasePlaceReviewCountByIdx(idx, 1);
  }

  public async decreasePlaceReviewCount(idx: number): Promise<void> {
    return await this.placeCoreRepository.decreasePlaceReviewCountByIdx(idx, 1);
  }

  public async increasePlaceBookmarkCount(idx: number): Promise<void> {
    return await this.placeCoreRepository.increasePlaceBookmarkCountByIdx(
      idx,
      1,
    );
  }

  public async decreasePlaceBookmarkCount(idx: number): Promise<void> {
    return await this.placeCoreRepository.decreasePlaceBookmarkCountByIdx(
      idx,
      1,
    );
  }

  public async increaseKeywordCount(
    placeIdx: number,
    keywordIdx: number,
  ): Promise<void> {
    return await this.placeCoreRepository.increaseKeywordCount(
      placeIdx,
      keywordIdx,
      1,
    );
  }

  public async decreaseKeywordCount(
    placeIdx: number,
    keywordIdx: number,
  ): Promise<void> {
    return await this.placeCoreRepository.decreaseKeywordCount(
      placeIdx,
      keywordIdx,
      1,
    );
  }
}
