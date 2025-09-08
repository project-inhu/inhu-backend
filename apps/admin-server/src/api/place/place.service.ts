import { CreatePlaceDto } from '@admin/api/place/dto/request/create-place.dto';
import { GetPlaceOverviewDto } from '@admin/api/place/dto/request/get-place-overview-all.dto';
import { UpdatePlaceDto } from '@admin/api/place/dto/request/update-place.dto';
import { PlaceOverviewEntity } from '@admin/api/place/entity/place-overview.entity';
import { PlaceEntity } from '@admin/api/place/entity/place.entity';
import { AlreadyActivatedPlaceException } from '@admin/api/place/exception/already-activated-place.exception';
import { AlreadyClosedPermanentlyPlaceException } from '@admin/api/place/exception/already-closed-permanently-place.exception';
import { AlreadyDeactivatedPlaceException } from '@admin/api/place/exception/already-deactivated-place.exception';
import { NotClosedPermanentlyPlaceException } from '@admin/api/place/exception/not-closed-permanently-place.exception';
import { PlaceNotFoundException } from '@admin/api/place/exception/place-not-found.exception';
import { GetPlaceOverviewInput } from '@libs/core/place/inputs/get-place-overview.input';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AddressSearchDocumentEntity } from '@libs/modules/kakao-address/entity/address-search-document.entity';
import { KakaoAddressService } from '@libs/modules/kakao-address/kakao-address.service';
import { AddressRequiredException } from './exception/address-required.exception';
import { AlreadyExistWeeklyClosedDayException } from './exception/already-exist-weekly-closed-day.exception';
import { WeeklyCloseType } from '@libs/core/place/constants/weekly-close-type.constant';

@Injectable()
export class PlaceService {
  constructor(
    private readonly placeCoreService: PlaceCoreService,
    private readonly kakaoAddressService: KakaoAddressService,
  ) {}

  public async getPlaceAll(
    dto: GetPlaceOverviewDto,
  ): Promise<{ placeList: PlaceOverviewEntity[]; count: number }> {
    const input: GetPlaceOverviewInput = {
      take: 10,
      skip: (dto.page - 1) * 10,
      activated: dto.active,
      order: 'desc',
      orderBy: 'time',
      searchKeyword: dto.search,
    };

    return {
      placeList: (await this.placeCoreService.getPlaceAll(input)).map(
        PlaceOverviewEntity.fromModel,
      ),
      count: await this.placeCoreService.getPlaceOverviewCount(input),
    };
  }

  public async getPlaceByIdx(idx: number): Promise<PlaceEntity> {
    const place = await this.placeCoreService.getPlaceByIdx(idx);

    if (!place) {
      throw new PlaceNotFoundException('Cannot find place with idx: ' + idx);
    }

    return PlaceEntity.fromModel(place);
  }

  public async createPlace(dto: CreatePlaceDto): Promise<PlaceEntity> {
    const addressDocument = await this.getAddressInfo(dto.roadAddress.name);

    return await this.placeCoreService
      .createPlace({
        name: dto.name,
        tel: dto.tel,
        isClosedOnHoliday: dto.isClosedOnHoliday,
        imgList: dto.imagePathList,
        type: dto.type,
        roadAddress: {
          name: dto.roadAddress.name,
          detail: dto.roadAddress.detail,
          addressX: parseFloat(addressDocument.x),
          addressY: parseFloat(addressDocument.y),
        },
        activatedAt: null,
        permanentlyClosedAt: null,
        closedDayList: dto.closedDayList.map(({ day, week }) => ({
          day,
          week,
        })),
        breakTimeList: dto.breakTimeList.map(({ startAt, endAt, day }) => ({
          startAt,
          endAt,
          day,
        })),
        operatingHourList: dto.operatingHourList.map(
          ({ startAt, endAt, day }) => ({
            startAt,
            endAt,
            day,
          }),
        ),
        weeklyClosedDayList: dto.weeklyClosedDayList.map(({ date, type }) => ({
          closedDate: date,
          type,
        })),
      })
      .then(PlaceEntity.fromModel);
  }

  public async updatePlaceByIdx(
    idx: number,
    dto: UpdatePlaceDto,
  ): Promise<void> {
    const place = await this.placeCoreService.getPlaceByIdx(idx);

    if (!place) {
      throw new PlaceNotFoundException('Cannot find place with idx: ' + idx);
    }

    const addressDocument = await this.getAddressInfo(dto.roadAddress.name);

    return await this.placeCoreService.updatePlaceByIdx(idx, {
      name: dto.name,
      tel: dto.tel,
      isClosedOnHoliday: dto.isClosedOnHoliday,
      imgList: dto.imagePathList,
      type: dto.type,
      roadAddress: {
        name: dto.roadAddress.name,
        detail: dto.roadAddress.detail,
        addressX: parseFloat(addressDocument.x),
        addressY: parseFloat(addressDocument.y),
      },
      closedDayList: dto.closedDayList.map(({ day, week }) => ({
        day,
        week,
      })),
      breakTimeList: dto.breakTimeList.map(({ startAt, endAt, day }) => ({
        startAt,
        endAt,
        day,
      })),
      operatingHourList: dto.operatingHourList.map(
        ({ startAt, endAt, day }) => ({
          startAt,
          endAt,
          day,
        }),
      ),
      weeklyClosedDayList: dto.weeklyClosedDayList.map(({ date, type }) => ({
        closedDate: date,
        type,
      })),
    });
  }

  public async deletePlaceByIdx(idx: number): Promise<void> {
    const place = await this.placeCoreService.getPlaceByIdx(idx);

    if (!place) {
      throw new PlaceNotFoundException('Cannot find place with idx: ' + idx);
    }

    return await this.placeCoreService.deletePlaceByIdx(idx);
  }

  public async activatePlaceByIdx(idx: number): Promise<void> {
    const place = await this.placeCoreService.getPlaceByIdx(idx);

    if (!place) {
      throw new PlaceNotFoundException('Cannot find place with idx: ' + idx);
    }

    if (place.activatedAt) {
      throw new AlreadyActivatedPlaceException(
        'Place is already activated: ' + idx,
      );
    }

    return await this.placeCoreService.updatePlaceByIdx(idx, {
      activatedAt: new Date(),
    });
  }

  public async deactivatePlaceByIdx(idx: number): Promise<void> {
    const place = await this.placeCoreService.getPlaceByIdx(idx);

    if (!place) {
      throw new PlaceNotFoundException('Cannot find place with idx: ' + idx);
    }

    if (!place.activatedAt) {
      throw new AlreadyDeactivatedPlaceException(
        'Place is not activated: ' + idx,
      );
    }

    return await this.placeCoreService.updatePlaceByIdx(idx, {
      activatedAt: null,
    });
  }

  public async closePermanentlyPlaceByIdx(idx: number): Promise<void> {
    const place = await this.placeCoreService.getPlaceByIdx(idx);

    if (!place) {
      throw new PlaceNotFoundException('Cannot find place with idx: ' + idx);
    }

    if (place.permanentlyClosedAt) {
      throw new AlreadyClosedPermanentlyPlaceException(
        'Place is already permanently closed: ' + idx,
      );
    }

    return await this.placeCoreService.updatePlaceByIdx(idx, {
      permanentlyClosedAt: new Date(),
    });
  }

  public async cancelClosePermanentlyPlaceByIdx(idx: number): Promise<void> {
    const place = await this.placeCoreService.getPlaceByIdx(idx);

    if (!place) {
      throw new PlaceNotFoundException('Cannot find place with idx: ' + idx);
    }

    if (!place.permanentlyClosedAt) {
      throw new NotClosedPermanentlyPlaceException(
        'Place is not permanently closed: ' + idx,
      );
    }

    return await this.placeCoreService.updatePlaceByIdx(idx, {
      permanentlyClosedAt: null,
    });
  }

  private async getAddressInfo(
    address: string,
  ): Promise<AddressSearchDocumentEntity> {
    if (!address) throw new AddressRequiredException('Address is required');

    const response = await this.kakaoAddressService.searchAddress(address);
    return response.documents[0];
  }

  public async createBiWeeklyClosedDayByPlaceIdx(
    idx: number,
    date: string,
  ): Promise<void> {
    const place = await this.placeCoreService.getPlaceByIdx(idx);

    if (!place) {
      throw new PlaceNotFoundException('Cannot find place with idx: ' + idx);
    }

    const existingClosedDay =
      await this.placeCoreService.getWeeklyClosedDayByDate(
        idx,
        date,
        WeeklyCloseType.BIWEEKLY,
      );

    if (existingClosedDay) {
      throw new AlreadyExistWeeklyClosedDayException(
        'Weekly closed day already exists' + idx,
      );
    }

    return await this.placeCoreService.createWeeklyClosedDay(
      idx,
      date,
      WeeklyCloseType.BIWEEKLY,
    );
  }

  public async createAllBiWeeklyClosedDay(date: string): Promise<{
    successCount: number;
    failureCount: number;
    errorList: { placeIdx: number; errorMessage: string }[];
  }> {
    return await this.placeCoreService.createAllBiWeeklyClosedDay(date);
  }
}
