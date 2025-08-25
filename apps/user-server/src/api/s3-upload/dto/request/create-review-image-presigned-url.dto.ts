import { IsEnumValue } from '@libs/common/decorator/is-enum-value.decorator';
import { ImageExtension } from '@libs/common/modules/s3/constants/image-extension.constants';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
} from 'class-validator';

/**
 * Presigned URL 여러개 생성을 위한 입력 값
 *
 * @author 조희주
 */
export class CreateReviewImagePresignedUrlsDto {
  /**
   * 업로드할 파일의 확장자명
   *
   * @example ["jpg", "png", "jpeg", "png"]
   */
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsEnumValue(ImageExtension, { each: true })
  @ArrayMaxSize(5)
  extensions: ImageExtension[];
}
