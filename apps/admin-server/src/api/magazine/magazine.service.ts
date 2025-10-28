import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMagazineDto } from './dto/request/create-magazine.dto';
import { MagazineEntity } from './entity/magazine.entity';
import { GetAllMagazineResponseDto } from './dto/response/get-all-magazine.response.dto';
import { GetAllMagazineDto } from './dto/request/get-all-magazine.dto';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { Transactional } from '@nestjs-cls/transactional';
import { UpdateMagazineActivatedAtByIdxDto } from './dto/request/update-magazine-activated-at-by-idx.dto';

@Injectable()
export class MagazineService {
  constructor(
    private readonly magazineCoreService: MagazineCoreService,
    private readonly placeCoreService: PlaceCoreService,
  ) {}

  public async getMagazineAll(
    dto: GetAllMagazineDto,
  ): Promise<GetAllMagazineResponseDto> {
    const TAKE = 10;
    const SKIP = (dto.page - 1) * TAKE;

    const magazineModelList = await this.magazineCoreService.getMagazineAll({
      take: TAKE + 1,
      skip: SKIP,
      activated: dto.activated,
    });

    const paginatedList = magazineModelList.slice(0, TAKE);
    const hasNext = magazineModelList.length > TAKE;

    return {
      magazineList: paginatedList.map(MagazineEntity.fromModel),
      hasNext,
    };
  }

  @Transactional()
  public async createMagazine(dto: CreateMagazineDto): Promise<MagazineEntity> {
    const placeIdxList = this.extractAllPlaceIdxFromText(dto.content);
    const invalidPlaceIdxList: number[] = [];

    if (placeIdxList && placeIdxList.length > 0) {
      for (const placeIdx of placeIdxList) {
        const place = await this.placeCoreService.getPlaceByIdx(placeIdx);
        if (!place) {
          invalidPlaceIdxList.push(placeIdx);
        }
      }
    }
    if (invalidPlaceIdxList.length > 0) {
      throw new NotFoundException(
        `Places not found for idx: ${invalidPlaceIdxList.join(', ')}`,
      );
    }

    return await this.magazineCoreService
      .createMagazine({
        title: dto.title,
        description: dto.description,
        content: dto.content,
        thumbnailImagePath: dto.thumbnailImagePath,
        isTitleVisible: dto.isTitleVisible,
        placeIdxList: placeIdxList,
      })
      .then(MagazineEntity.fromModel);
  }

  public async updateMagazineActivatedAtByIdx(
    idx: number,
    dto: UpdateMagazineActivatedAtByIdxDto,
  ): Promise<void> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(
      idx,
      false,
    );
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    await this.magazineCoreService.updateMagazineActivatedAtByIdx(
      idx,
      dto.activate,
    );
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
