import { IsArray, IsString } from 'class-validator';

export class UploadPlaceImageByPlaceIdxDto {
  @IsArray()
  @IsString({ each: true })
  placeImageList: string[];
}
