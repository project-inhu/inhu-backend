/**
 * 프로필 이미지 수정을 위한 입력 값
 *
 * @author 조희주
 */
export class UpdateProfileImageInput {
  userIdx: number;
  file?: Express.Multer.File;
}
