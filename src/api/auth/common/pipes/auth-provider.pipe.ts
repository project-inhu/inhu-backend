import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AuthProvider } from '../../enum/auth-provider.enum';

@Injectable()
export class AuthProviderPipe implements PipeTransform<string, AuthProvider> {
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
