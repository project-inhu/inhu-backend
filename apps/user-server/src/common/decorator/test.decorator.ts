import {
  Aspect,
  createDecorator,
  LazyDecorator,
  WrapParams,
} from '@toss/nestjs-aop';

export const TEST_DECORATOR = Symbol('TEST_DECORATOR');

@Aspect(TEST_DECORATOR)
export class TestDecorator implements LazyDecorator<any, any> {
  wrap(params: WrapParams<any, any>) {
    return (...args: any) => {
      console.log('before...');
      const result = params.method(...args);
      console.log('after...');
      return result;
    };
  }
}

export const Test = () => createDecorator(TEST_DECORATOR);
