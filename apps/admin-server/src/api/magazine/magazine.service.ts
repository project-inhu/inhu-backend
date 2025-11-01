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
import { GetAllMagazineInput } from '@libs/core/magazine/inputs/get-all-magazine.input';
import { ActivateMagazineByIdxDto } from './dto/request/activate-magazine-by-idx.dto';
import { UpdateMagazineByIdxDto } from './dto/request/update-magazine-by-idx.dto';

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
    const input: GetAllMagazineInput = {
      take: 10,
      skip: (dto.page - 1) * 10,
      activated: dto.activated,
      pinned: dto.pinned,
    };

    return {
      magazineList: (await this.magazineCoreService.getMagazineAll(input)).map(
        MagazineOverviewEntity.fromModel,
      ),
      count: await this.magazineCoreService.getMagazineCount(input),
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

  public async activateMagazineByIdx(
    idx: number,
    dto: ActivateMagazineByIdxDto,
  ): Promise<void> {
    const isActivate = dto.activate;
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);

    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    if (isActivate && magazine.activatedAt) {
      throw new ConflictException(`Magazine is already activated: ${idx}`);
    }

    if (!isActivate && !magazine.activatedAt) {
      throw new ConflictException(`Magazine is not activated: ${idx}`);
    }

    await this.magazineCoreService.updateMagazineByIdx(idx, {
      activate: isActivate,
    });
  }

  public async updateMagazineByIdx(
    idx: number,
    dto: UpdateMagazineByIdxDto,
  ): Promise<void> {
    const magazine = await this.magazineCoreService.getMagazineByIdx(idx);
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    const extractedPlaceIdxList = this.extractAllPlaceIdxFromText(
      dto.content ?? magazine.content,
    );
    const validPlaceList: number[] = [];

    if (extractedPlaceIdxList.length > 0) {
      validPlaceList.push(
        ...(await this.placeCoreService
          .getPlaceByIdxList(extractedPlaceIdxList)
          .then((places) => places.map((place) => place.idx))),
      );
    }

    await this.magazineCoreService.updateMagazineByIdx(idx, {
      title: dto.title,
      description: dto.description,
      content: dto.content,
      thumbnailImagePath: dto.thumbnailImagePath,
      isTitleVisible: dto.isTitleVisible,
      placeIdxList: validPlaceList,
    });
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
