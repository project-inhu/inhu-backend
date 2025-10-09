import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import { Injectable } from '@nestjs/common';
import { CreateMagazineDto } from './dto/request/create-magazine.dto';
import { MagazineEntity } from './entity/magazine.entity';
import { GetAllMagazineResponseDto } from './dto/response/get-all-magazine.response.dto';
import { GetAllMagazineDto } from './dto/request/get-all-magazine.dto';

@Injectable()
export class MagazineService {
  constructor(private readonly magazineCoreService: MagazineCoreService) {}

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

  public async createMagazine(dto: CreateMagazineDto): Promise<MagazineEntity> {
    return await this.magazineCoreService
      .createMagazine({
        title: dto.title,
        content: dto.content,
        thumbnailImagePath: dto.thumbnailImagePath,
        isTitleVisible: dto.isTitleVisible,
        placeIdxList: this.extractAllPlaceIdxFromText(dto.content),
      })
      .then(MagazineEntity.fromModel);
  }

  private extractAllPlaceIdxFromText(bodyText: string): number[] {
    const regex = /https:\/\/inhu\.co\.kr\/place\/(\d+)\/?/g;

    const matches = [...bodyText.matchAll(regex)];
    const idxList = matches.map((match) => parseInt(match[1], 10));

    return idxList;
  }
}
