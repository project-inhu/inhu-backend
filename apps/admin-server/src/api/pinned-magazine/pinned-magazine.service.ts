import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PinMagazineByIdxDto } from './dto/request/pin-magazine-by-idx.dto';
import { PinnedMagazineCoreService } from '@libs/core/pinned-magazine/pinned-magazine-core.service';

@Injectable()
export class PinnedMagazineService {
  constructor(
    private readonly magazineCoreService: MagazineCoreService,
    private readonly pinnedMagazineCoreService: PinnedMagazineCoreService,
  ) {}

  public async pinMagazineByIdx(
    idx: number,
    dto: PinMagazineByIdxDto,
  ): Promise<void> {
    const magazine =
      await this.pinnedMagazineCoreService.getPinnedMagazineByIdx(idx);
    const isPin = dto.pinned;
    if (!magazine) {
      throw new NotFoundException(`Magazine not found for idx: ${idx}`);
    }

    if (isPin && magazine) {
      throw new ConflictException(`Magazine is already pinned: ${idx}`);
    }
    if (!isPin && !magazine) {
      throw new ConflictException(`Magazine is not pinned: ${idx}`);
    }

    if (isPin) {
      await this.pinnedMagazineCoreService.createPinnedMagazineByIdx(idx);
    } else {
      await this.pinnedMagazineCoreService.deletePinnedMagazineByIdx(idx);
    }
  }
}
