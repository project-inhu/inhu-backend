import { PrismaService } from '../module/prisma/prisma.service';

/**
 * Prisma transaction 내부에서 사용되는 tx의 정확한 타입
 *
 * @author 강정연
 */
export type PrismaTransactionClient = Parameters<
  Parameters<PrismaService['$transaction']>[0]
>[0];
