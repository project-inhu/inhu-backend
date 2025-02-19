import { Param } from '@nestjs/common';
import { ValidateProviderPipe } from '../pipes/validate-provider.pipe';

/**
 * 소셜 로그인 provider(제공자) 파라미터를 검증하는 데코레이터
 *
 * @returns provider 파라미터 값을 검증하는 파이프가 적용된 Param 데코레이터
 *
 * @author 강정연
 */
export function Provider() {
  return Param('provider', ValidateProviderPipe);
}
