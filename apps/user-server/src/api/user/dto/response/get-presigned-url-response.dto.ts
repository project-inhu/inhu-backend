/**
 * Presigned Url Response Dto
 *
 * @author 조희주
 */

export class GetPresignedUrlResponseDto {
  /**
   * S3에 파일을 직접 업로드할 때 사용하는 정해진 시간 동안만 유효한 임시 URL
   * @example "https://inhu.s3.ap-northeast-2.amazonaws.com/path/to/file?AWSAccessKeyId=..."
   */
  presignedUrl: string;

  /**
   * S3에 파일 업로드 완료 후 S3 버킷에 저장될 파일의 최종 경로이자 고유 식별자
   * @example "/profile/myprofile.jpg"
   */
  key: string;
}
