import { FilledSeed } from '@libs/common';
import { PrismaService } from '@libs/common/modules/prisma/prisma.service';

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
  public abstract generateFilledInputValue(input: TInput): FilledSeed<TInput>;

  public async seedAll(inputs: TInput[]): Promise<TOutput[]> {
    return await Promise.all(inputs.map((input) => this.seed(input)));
  }
}
