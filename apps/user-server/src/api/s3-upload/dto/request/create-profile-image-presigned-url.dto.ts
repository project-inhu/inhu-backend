import {
  IMAGE_EXTENSION,
  ImageExtension,
} from '@libs/common/modules/s3/constants/image-extension.constants';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

/**
 * Presigned URL 생성을 위한 입력 값
 *
 * @author 조희주
 */
export class CreateProfileImagePresignedUrlDto {
  /**
   * 업로드할 파일의 확장자명
   *
   * @example "jpg"
   */
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(IMAGE_EXTENSION))
  extension: ImageExtension;
}
