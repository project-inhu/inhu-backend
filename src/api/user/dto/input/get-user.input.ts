import { IsInt, IsPositive } from 'class-validator';

/**
 * 사용자 정보를 조회하기 위한 입력 값
 *
 * @author 조희주
 */
export class GetUserInput {
  @IsInt()
  @IsPositive()
  idx: number;
}
