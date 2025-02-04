import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic'; // 메타데이터 키 정의
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); // 데코레이터 정의
