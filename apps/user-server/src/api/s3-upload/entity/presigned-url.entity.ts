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
  url: string;

  /**
   * 프론트엔드에서 form-data에 포함해야 하는 모든 필드와 값들의 객체
   * (Key, Policy, Signature 등)
   */
  fields: Record<string, string>;

  constructor(data: PresignedUrlEntity) {
    Object.assign(this, data);
  }

  public static fromModel(model: PresignedUrlModel): PresignedUrlEntity {
    return new PresignedUrlEntity({
      url: model.url,
      fields: model.fields,
    });
  }
}
