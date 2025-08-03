import {
  IMAGE_EXTENSION,
  ImageExtension,
} from '@libs/common/modules/s3/constants/image-extension.constants';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsString,
} from 'class-validator';

/**
 * Presigned URL 여러개 생성을 위한 입력 값
 *
 * @author 조희주
 */
export class CreatePlaceImagePresignedUrlsDto {
  /**
   * 업로드할 파일의 확장자명
   *
    @example ["jpg", "png", "jpeg"]
   */
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsIn(Object.values(IMAGE_EXTENSION), { each: true })
  @ArrayMaxSize(5)
  extensions: ImageExtension[];
}
