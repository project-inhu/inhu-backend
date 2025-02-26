import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async truncate() {
    const records = await this.$queryRawUnsafe<Array<any>>(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);
    records.forEach((record) => this.truncateTable(record['tablename']));
  }

  async truncateTable(tablename: string) {
    if (!tablename || tablename === '_prisma_migrations') return;
    await this.$executeRawUnsafe(
      `TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
    );
  }

  async resetSequences() {
    const results = await this.$queryRawUnsafe<Array<any>>(`
      SELECT c.relname
      FROM pg_class AS c
      JOIN pg_namespace AS n
      ON c.relnamespace = n.oid
      WHERE c.relkind = 'S'
      AND n.nspname = 'public'
    `);
    for (const result of results) {
      await this.$executeRawUnsafe(
        `ALTER SEQUENCE "public"."${result.relname}" RESTART WITH 1;`,
      );
    }
  }
}
