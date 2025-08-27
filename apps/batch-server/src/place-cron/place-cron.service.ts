import { DateUtilService } from '@libs/common/modules/date-util/date-util.service';
import { PlaceCoreService } from '@libs/core/place/place-core.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PlaceCronService {
  constructor(
    private readonly placeCoreService: PlaceCoreService,
    private readonly dateUtilService: DateUtilService,
    private readonly logger: Logger,
  ) {}

  /**
   * 격주 휴무일 장소에 대해 14일 뒤 다음 휴무일을 추가
   *
   * @author 강정연
   */
  public async AddNextBiWeeklyClosedDay(): Promise<void> {
    const now = this.dateUtilService.getNow();
    const kstStr = this.dateUtilService.transformKoreanDate(now);

    const result = await this.placeCoreService.createAllWeeklyClosedDay(kstStr);

    const failIdxList = result.errorList.map((e) => e.placeIdx).join(', ');

    if (result.errorList.length > 0) {
      const failLogs = result.errorList
        .map(
          (e) =>
            `placeIdx=${e.placeIdx}, error=${e.error instanceof Error ? e.error.message : JSON.stringify(e.error)}`,
        )
        .join('\n');

      this.logger.error(
        `🚨 Bi-Weekly ClosedDay 배치 실패\n` +
          `성공: ${result.success}, 실패: ${result.errorList.length}\n` +
          `실패 placeIdx: ${failIdxList}\n` +
          `실패 로그:\n${failLogs}`,
      );
    } else {
      this.logger.log(
        `✅ Bi-Weekly ClosedDay 배치 완료 (성공 ${result.success}건)`,
      );
    }
  }
}
