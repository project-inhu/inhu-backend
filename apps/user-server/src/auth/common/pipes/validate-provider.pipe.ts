import { Injectable, PipeTransform } from '@nestjs/common';
import {
  AUTH_PROVIDERS,
  AuthProviderValue,
} from '@user/auth/common/constants/auth-provider.constant';

/**
 * 소셜 로그인 provider(제공자) 파라미터를 검증하는 파이프
 * - `AuthProviderType`에 정의된 제공자 이름과 일치하는지 확인
 *
 * @author 이수인
 */

@Injectable()
export class ValidateProviderPipe implements PipeTransform {
  transform(value: string): AuthProviderValue | null {
    if (
      Object.values(AUTH_PROVIDERS).some(
        (provider) =>
          provider.name.toLocaleLowerCase() === value.toLocaleLowerCase(),
      )
    ) {
      return value as AuthProviderValue;
    }
    return null;
  }
}
