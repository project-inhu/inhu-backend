import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * YYYY-MM-DD 형식의 한국 날짜를 검사하는 데코레이터입니다.
 *
 * @publicApi
 */
export const IsKoreanDate = (option?: ValidationOptions) => {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isKoreanDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: option,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          // 정규 표현식으로 한국 날짜 형식 (YYYY-MM-DD) 검사
          const koreanDateRegex =
            /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
          return koreanDateRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return (
            propertyName +
            ' must be a valid Korean date in the format YYYY-MM-DD'
          );
        },
      },
    });
  };
};
