import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { AuthProvider } from '../enum/auth-provider.enum';

@Injectable()
export class ValidateProviderPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): string {
    if (!Object.values(AuthProvider).includes(value as AuthProvider)) {
      throw new BadRequestException('Invalid provider');
    }
    return value;
  }
}
