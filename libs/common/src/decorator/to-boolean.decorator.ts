import { Transform } from 'class-transformer';

/**
 * 전달된 값을 boolean으로 형변환하는 프로퍼티 데코레이터.
 * querystring으로 전달되는 dto에 사용하기를 기대합니다.
 * value가 반드시 string 타입일 필요가 없는 경우 사용할 필요가 없습니다.
 *
 * @author jochongs
 *
 * @decorator Property
 */
export const ToBoolean = () => {
  return Transform((value) => {
    if (!['true', 'false'].includes(value.value)) {
      return value.value;
    }

    return value.value == 'true';
  });
};
