import { S3Folder } from '../constants/s3-folder.constants';

/**
 * Presigned URL 생성을 위한 입력 값
 *
 * @author 조희주
 */
export class GetPresignedUrlsInput {
  folder: S3Folder;
  filename: string[];
}
