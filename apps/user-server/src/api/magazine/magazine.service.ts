import { MagazineCoreService } from '@libs/core/magazine/magazine-core.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MagazineService {
  constructor(private readonly magazineCoreService: MagazineCoreService) {}
}
