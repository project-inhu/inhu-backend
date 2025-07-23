import { Module } from '@nestjs/common';
import { HashService } from 'apps/admin-server/src/common/modules/hash/hash.service';

@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
