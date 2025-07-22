import { S3_FOLDER, S3Folder } from '@libs/common';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

/**
 * Presigned URL 생성을 위한 입력 값
 *
 * @author 조희주
 */
export class CreatePresignedUrlDto {
  /**
   * S3에 업로드할 파일의 폴더 경로
   *
   * @example "profile"
   */
  @IsNotEmpty()
  @IsIn(Object.values(S3_FOLDER))
  folder: S3Folder;

  /**
   * 업로드할 파일의 원본 이름
   * 프론트엔드에서 사용자가 선택한 파일의 .name 속성 값
   *
   * @example "myProfile.jpg"
   */
  @IsNotEmpty()
  @IsString()
  filename: string;
}
