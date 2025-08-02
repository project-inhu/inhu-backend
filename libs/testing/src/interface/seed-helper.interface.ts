import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { FilledSeedInput } from '@libs/testing/types/SeedFilledValue';

/**
 * 시딩 헬퍼 인터페이스입니다.
 * 이 인터페이스는 시딩 작업을 수행하는 헬퍼 클래스에서 구현해야 하는 메서드를 정의합니다.
 *
 * @publicApi
 */
export abstract class ISeedHelper<TInput = any, TOutput = any> {
  protected readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  /**
   * 시딩하는 메서드입니다.
   */
  public abstract seed(input: TInput): Promise<TOutput>;

  /**
   * input에 필요한 값을 채워주는 메서드입니다.
   */
  public abstract generateFilledInputValue(
    input: TInput,
  ): FilledSeedInput<TInput>;

  public async seedAll(inputs: TInput[]): Promise<TOutput[]> {
    return await Promise.all(inputs.map((input) => this.seed(input)));
  }
}
