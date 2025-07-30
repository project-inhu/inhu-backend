import { PresignedUrlModel } from '@libs/common';

/**
 * presignedUrl 응답을 위한 entity
 *
 * @author 조희주
 */

export class PresignedUrlEntity {
  /**
   * 파일을 S3에 `multipart/form-data` 형태로 `POST` 업로드할 때 요청을 보낼 S3 버킷의 엔드포인트 URL
   * 이 URL 자체는 서명되지 않으며, 함께 제공되는 `fields`를 통해 인증 및 정책 검증이 이루어짐
   *
   * @example "https://inhu.s3.ap-northeast-2.amazonaws.com/"
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
