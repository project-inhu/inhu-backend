import { PrismaService } from '@libs/common/modules/prisma/prisma.service';

export abstract class SeedHelper<TInput, TOutput> {
  protected readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  public abstract seed(input: TInput): Promise<TOutput>;

  public async seedAll(inputs: TInput[]): Promise<TOutput[]> {
    return await Promise.all(inputs.map((input) => this.seed(input)));
  }
}
