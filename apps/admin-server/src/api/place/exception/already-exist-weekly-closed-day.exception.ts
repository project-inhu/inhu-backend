import { ConflictException } from '@nestjs/common';

export class AlreadyExistWeeklyClosedDayException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
