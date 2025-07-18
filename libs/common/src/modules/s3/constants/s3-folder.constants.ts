/**
 * S3 업로드 시 사용할 폴더 이름 정의
 *
 * @author 조희주
 */
export const S3_FOLDER = {
  MENU: 'menu',
  PLACE: 'place',
  PROFILE: 'profile',
  BANNER: 'banner',
  REVIEW: 'review',
} as const;

export type S3Folder = (typeof S3_FOLDER)[keyof typeof S3_FOLDER];
