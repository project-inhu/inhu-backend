import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

@Injectable()
export class AdminPlaceRepository {
  constructor(private prisma: PrismaService) {}
}
