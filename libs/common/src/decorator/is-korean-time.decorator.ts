import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * HH:MM:SS 형식의 한국 시간을 검사하는 데코레이터입니다.
 */
export const IsKoreanTime = (option?: ValidationOptions) => {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isKoreanTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: option,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          // 정규 표현식으로 한국 시간 형식 (HH:MM:SS) 검사
          const koreanTimeRegex =
            /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
          return koreanTimeRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return (
            propertyName + ' must be a valid Korean time in the format HH:MM:SS'
          );
        },
      },
    });
  };
};
