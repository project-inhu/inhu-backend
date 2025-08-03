/**
 * S3 업로드 시 허용할 이미지 확장자
 *
 * @author 조희주
 * @publicApi
 */
export const IMAGE_EXTENSION = {
  JPG: 'jpg',
  JPEG: 'jpeg',
  PNG: 'png',
} as const;

export type ImageExtension =
  (typeof IMAGE_EXTENSION)[keyof typeof IMAGE_EXTENSION];
