import { SetMetadata } from '@nestjs/common';

// @Public() 사용시 -> isPublic = true
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);