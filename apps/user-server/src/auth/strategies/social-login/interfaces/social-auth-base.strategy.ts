import { Request } from 'express';
import { CreateUserEntity } from 'src/api/user/entity/create-user.entity';

/**
 * 소셜 로그인 인증 전략의 기본 인터페이스
 * - 소셜 로그인 인증 페이지 URL을 반환하는 메서드와
 * - 최종 로그인 프로세스를 수행하는 메서드를 정의
 *
 * @author 이수인
 */
export interface ISocialAuthStrategy<
  TProvider = string,
  TToken = any,
  TUserInfo = any,
  TDto = any,
> {
  /**
   * 요청에서 인증 코드를 추출
   *
   * @author 이수인
   */
  extractDtoFromRequest(req: Request): TDto;

  /**
   * 소셜 로그인 인증 페이지 URL을 반환
   *
   * @author 이수인
   */
  getAuthLoginUrl(): string;

  /**
   * 소셜 로그인에 대한 최종 로그인 프로세스를 수행
   *
   * @author 이수인
   */
  login(dto: TDto): Promise<CreateUserEntity>;
}
