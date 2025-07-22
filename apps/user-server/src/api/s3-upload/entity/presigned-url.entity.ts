import { PresignedUrlModel } from '@libs/common';

/**
 * presignedUrl 응답을 위한 entity
 *
 * @author 조희주
 */

export class PresignedUrlEntity {
  /**
   * S3에 파일을 직접 업로드할 때 사용하는 정해진 시간 동안만 유효한 임시 URL
   *
   * @example "https://inhu.s3.ap-northeast-2.amazonaws.com/profile/a1b2c3d4-e5f6...-myphoto.jpg?X-Amz-Algorithm=..."
   */
  presignedUrl: string;

  /**
   * S3에 파일 업로드 완료 후 S3 버킷에 저장될 파일의 최종 경로이자 고유 식별자
   *
   * @example '/profile/a1b2c3d4-e5f6-7890-1234-abcdefghijkl-myphoto.jpg'
   */
  key: string;

  constructor(data: PresignedUrlEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: PresignedUrlModel): PresignedUrlEntity {
    return new PresignedUrlEntity({
      presignedUrl: model.presignedUrl,
      key: model.key,
    });
  }
}
