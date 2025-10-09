import { PlaceRoadAddressModel } from '@libs/core/place/model/place-road-address.model';
import { SelectMagazinePlace } from './prisma-type/select-magazine-place';

export class MagazinePlaceModel {
  /**
   * 장소 식별자
   */
  public idx: number;

  /**
   * 장소 이름
   */
  public name: string;

  /**
   * 장소 전화번호
   */
  public tel: string | null;

  /**
   * 도로명 주소
   */
  public roadAddress: PlaceRoadAddressModel;

  public placeImageList: string[];

  constructor(data: MagazinePlaceModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    magazinePlace: SelectMagazinePlace,
  ): MagazinePlaceModel {
    return new MagazinePlaceModel({
      idx: magazinePlace.place.idx,
      name: magazinePlace.place.name,
      tel: magazinePlace.place.tel,
      roadAddress: PlaceRoadAddressModel.fromPrisma(
        magazinePlace.place.roadAddress,
      ),
      placeImageList: magazinePlace.place.placeImageList.map(
        ({ path }) => path,
      ),
    });
  }
}
