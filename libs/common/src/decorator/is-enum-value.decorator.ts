import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { getEnumValues } from '../utils/get-enum-values.util';

/**
 * enum의 value만 허용하는 데코레이터
 *
 * @author 이수인
 * @publicApi
 */
export const IsEnumValue = (
  enumObject: any,
  validationOptions?: ValidationOptions,
) => {
  return function (object: Object, propertyName: string) {
    const enumValues = getEnumValues(enumObject);

    registerDecorator({
      name: 'isEnumValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumObject],
      validator: {
        validate(value: any, args: ValidationArguments) {
          return enumValues.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be one of the following values: ${enumValues.join(', ')}`;
        },
      },
    });
  };
};
