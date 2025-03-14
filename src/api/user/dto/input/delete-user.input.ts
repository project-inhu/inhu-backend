import { IsInt, IsPositive } from 'class-validator';

/**
 * 사용자 계정을 삭제하기 위한 입력 값
 *
 * @author 조희주
 */
export class DeleteUserInput {
  @IsInt()
  @IsPositive()
  idx: number;
}
