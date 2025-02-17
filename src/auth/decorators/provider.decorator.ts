import { Param } from '@nestjs/common';
import { ValidateProviderPipe } from '../pipe/validate-provider.pipe';

export function provider() {
  return Param('provider', ValidateProviderPipe);
}
