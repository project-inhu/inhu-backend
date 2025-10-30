import { PickType } from '@nestjs/swagger';
import { GetAllMagazineInput } from './get-all-magazine.input';

export class GetAllLikedMagazineInput extends PickType(GetAllMagazineInput, [
  'take',
  'skip',
  'activated',
  'orderBy',
]) {
  userIdx: number;
}
