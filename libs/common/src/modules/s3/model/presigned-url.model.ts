/**
 * Presigned URL과 파일 키를 담는 모델
 *
 * @author 조희주
 * @publicApi
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

  /**
   * 접근할 수 있는 경로
   *
   * @example "https://d173x58k9mwzh3.cloudfront.net" -> 배포서버: Cloud Front 주소로 감
   * @example "https://inhu.s3.ap-northeast-2.amazonaws.com" -> 개발서버: S3 주소로 감
   */
  fileHost: string;

  /**
   * S3에 업로드 된 파일의 경로
   *
   * @example "/place/c37409c8-11b4-4c24b2c5-3747aad1b846.png"
   */
  filePath: string;
}
