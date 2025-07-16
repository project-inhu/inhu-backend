import { Injectable } from '@nestjs/common';
import { AdminPlaceRepository } from './admin-place.repository';

@Injectable()
export class AdminPlaceService {
  constructor(private readonly adminPlaceRepository: AdminPlaceRepository) {}
}
