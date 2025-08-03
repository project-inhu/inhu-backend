/**
 * S3 Presigned Post의 Content-Type Condition에 사용할 상수
 *
 * @author 조희주
 */
export const CONTENT_TYPE = {
  IMAGE: 'image/',
  VIDEO: 'video/',
} as const;

export type ContentType = (typeof CONTENT_TYPE)[keyof typeof CONTENT_TYPE];
