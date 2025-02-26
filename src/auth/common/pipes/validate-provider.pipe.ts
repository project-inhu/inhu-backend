import { Injectable, PipeTransform } from '@nestjs/common';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';

/**
 * 소셜 로그인 provider 검증 파이프
 * - 요청된 provider 값이 AuthProvider 열거형에 포함되어 있는지 검증
 *
 * 유효하지 않은 provider 값인 경우 null return
 *
 * @author 강정연
 */
@Injectable()
export class ValidateProviderPipe implements PipeTransform {
  transform(value: string): AuthProvider | null {
    const provider = Object.values(AuthProvider).find(
      (p) => p.toLowerCase() === value.toLowerCase(),
    );

    if (!provider) {
      return null;
    }

    return provider;
  }
}
