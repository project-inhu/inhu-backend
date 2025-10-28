import { IsBoolean } from 'class-validator';

export class UpdateMagazineActivatedAtByIdxDto {
  @IsBoolean()
  activate: boolean;
}
