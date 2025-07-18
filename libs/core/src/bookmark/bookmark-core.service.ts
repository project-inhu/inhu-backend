import { BookmarkCoreRepository } from './bookmark-core.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkCoreService {
  constructor(private readonly bookmarkCoreReposit: BookmarkCoreRepository) {}
}
