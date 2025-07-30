/**
 * Presigned URL과 파일 키를 담는 모델
 *
 * @author 조희주
 */
export class PresignedUrlModel {
  /**
   * S3에 파일을 직접 업로드할 때 사용하는 정해진 시간 동안만 유효한 임시 URL (presignedUrl)
   */
  url: string;

  /**
   * 프론트엔드에서 form-data에 포함해야 하는 모든 필드와 값들의 객체
   * (Key, Policy, Signature 등)
   */
  fields: Record<string, string>;
}
