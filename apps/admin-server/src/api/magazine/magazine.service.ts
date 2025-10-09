import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import { Injectable } from '@nestjs/common';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { MagazineEntity } from './entity/magazine.entity';

@Injectable()
export class MagazineService {
  constructor(private readonly magazineCoreService: MagazineCoreService) {}

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
