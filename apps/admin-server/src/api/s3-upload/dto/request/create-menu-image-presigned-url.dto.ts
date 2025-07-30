import {
  IMAGE_EXTENSION,
  ImageExtension,
} from '@libs/common/modules/s3/constants/image-extension.constants';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

/**
 * Menu Image의 Presigned URL 생성을 위한 입력 값
 *
 * @author 조희주
 */
export class CreateMenuImagePresignedUrlDto {
  /**
   * 업로드할 파일의 확장자명
   *
   * @example "jpg"
   */
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.values(IMAGE_EXTENSION))
  extension: ImageExtension;

  /**
   * 최대 파일 크기 (MB 단위)
   *
   * @example "10"
   */
  @IsNumber()
  @IsPositive()
  maxSize: number;

  /**
   * 허용할 Content-Type 시작 문자열
   *
   * @example "image/"
   */
  @IsString()
  @IsNotEmpty()
  contentType: string;
}
