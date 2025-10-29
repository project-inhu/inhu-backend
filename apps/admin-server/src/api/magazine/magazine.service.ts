import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMagazineDto } from './dto/request/create-magazine.dto';
import { MagazineEntity } from './entity/magazine.entity';
import { GetAllMagazineResponseDto } from './dto/response/get-all-magazine.response.dto';
import { GetAllMagazineDto } from './dto/request/get-all-magazine.dto';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { Transactional } from '@nestjs-cls/transactional';
import { MagazineNotFoundException } from '@admin/api/magazine/exception/MagazineNotFoundException';
import { MagazineOverviewEntity } from './entity/magazine-overview.entity';

@Injectable()
export class MagazineService {
  constructor(
    private readonly magazineCoreService: MagazineCoreService,
    private readonly placeCoreService: PlaceCoreService,
  ) {}

  public async getMagazineByIdx(idx: number): Promise<MagazineEntity> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);

    if (!magazine) {
      throw new MagazineNotFoundException('Cannot find magazine idx: ' + idx);
    }

    return MagazineEntity.fromModel(magazine);
  }

  public async getMagazineAll(
    dto: GetAllMagazineDto,
  ): Promise<GetAllMagazineResponseDto> {
    const TAKE = 10;
    const SKIP = (dto.page - 1) * TAKE;

    const magazineOverviewModelList =
      await this.magazineCoreService.getMagazineAll({
        take: TAKE + 1,
        skip: SKIP,
        activated: dto.activated,
      });

    return {
      magazineList: magazineOverviewModelList.map(
        MagazineOverviewEntity.fromModel,
      ),
      count: magazineOverviewModelList.length,
    };
  }

  @Transactional()
  public async createMagazine(dto: CreateMagazineDto): Promise<MagazineEntity> {
    const extractedPlaceIdxList = this.extractAllPlaceIdxFromText(dto.content);
    const validPlaceList: number[] = [];

    if (extractedPlaceIdxList.length > 0) {
      validPlaceList.push(
        ...(await this.placeCoreService
          .getPlaceByIdxList(extractedPlaceIdxList)
          .then((places) => places.map((place) => place.idx))),
      );
    }

    return await this.magazineCoreService
      .createMagazine({
        title: dto.title,
        description: dto.description,
        content: dto.content,
        thumbnailImagePath: dto.thumbnailImagePath,
        isTitleVisible: dto.isTitleVisible,
        placeIdxList: validPlaceList,
      })
      .then(MagazineEntity.fromModel);
  }

  public async activateMagazineByIdx(idx: number): Promise<void> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    if (magazine.activatedAt) {
      throw new ConflictException(`Magazine is already activated: ${idx}`);
    }

    await this.magazineCoreService.updateMagazineByIdx(idx, true);
  }

  public async deactivateMagazineByIdx(idx: number): Promise<void> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    if (!magazine.activatedAt) {
      throw new ConflictException(`Magazine is not activated: ${idx}`);
    }

    await this.magazineCoreService.updateMagazineByIdx(idx, false);
  }

  public async deleteMagazineByIdx(idx: number): Promise<void> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    await this.magazineCoreService.deleteMagazineByIdx(idx);
  }

  private extractAllPlaceIdxFromText(bodyText: string): number[] {
    const regex = /:::place-(\d+):::/g;

    const matches = [...bodyText.matchAll(regex)];
    const idxList = matches.map((match) => parseInt(match[1], 10));

    return Array.from(new Set(idxList));
  }
}
