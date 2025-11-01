import { PinnedMagazineCoreService } from '@libs/core/pinned-magazine/pinned-magazine-core.service';
import { Controller } from '@nestjs/common';

@Controller()
export class PinnedMagazineController {
  constructor(
    private readonly pinnedMagazineCoreService: PinnedMagazineCoreService,
  ) {}
}
