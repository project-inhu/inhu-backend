import { Controller } from '@nestjs/common';
import { MagazineService } from './magazine.service';

@Controller('magazine')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}
}
