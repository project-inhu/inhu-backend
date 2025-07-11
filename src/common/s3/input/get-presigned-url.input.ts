import { S3Folder } from '../enums/s3-folder.enum';
/**
 * Presigned URL 생성을 위한 입력 값
 *
 * @author 조희주
 */
export class GetPresignedUrlInput {
  folder: S3Folder;
  filename: string;
}
