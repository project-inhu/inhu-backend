import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AuthProvider } from 'src/auth/enums/auth-provider.enum';

/**
 * 소셜 로그인 provider 검증 파이프
 * - 요청된 provider 값이 AuthProvider 열거형에 포함되어 있는지 검증
 *
 * @throws {BadRequestException} 유효하지 않은 provider 값인 경우 예외 발생
 *
 * @author 강정연
 */
@Injectable()
export class ValidateProviderPipe implements PipeTransform {
  transform(value: string): AuthProvider {
    const provider = Object.values(AuthProvider).find(
      (p) => p.toLowerCase() === value.toLowerCase(),
    );

    if (!provider) {
      throw new BadRequestException('Invalid provider');
    }

    return provider;
  }
}
