/**
 * Presigned URL과 파일 키를 담는 모델
 *
 * @author 조희주
 */
export class PresignedUrlModel {
  presignedUrl: string;
  /**
   * S3 버킷 내 파일의 객체 키 (폴더/uuid-filename 형식)
   */
  key: string;
}
