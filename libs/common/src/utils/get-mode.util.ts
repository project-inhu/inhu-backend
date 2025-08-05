/**
 * 현재 실행 모드를 반환하는 유틸리티 함수
 *
 * @publicApi
 */
export const getMode = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  } else if (process.env.NODE_ENV === 'production') {
    return 'production';
  } else if (process.env.NODE_ENV === 'test') {
    return 'test';
  }

  throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`);
};
