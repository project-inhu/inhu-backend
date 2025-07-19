import { PrismaService } from '@libs/common/modules/prisma/prisma.service';
import { DeepRequired } from '@libs/common/types/DeepRequired';

export abstract class ISeedHelper<TInput = any, TOutput = any> {
  protected readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  public abstract seed(input: TInput): Promise<TOutput>;

  public abstract getRequiredInput(input: TInput): DeepRequired<TInput>;

  public async seedAll(inputs: TInput[]): Promise<TOutput[]> {
    return await Promise.all(inputs.map((input) => this.seed(input)));
  }
}
