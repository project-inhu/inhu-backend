import { OperatingTimeInfo } from './operating-time-info.type';

/**
 * 전체 요일별 영업 시간표
 * 각 요일에 여러 개의 영업 시간 블록이 올 수 있음
 *
 * @author 강정연
 *
 * @deprecated
 */
export class OperatingWeekSchedule {
  [key: number]: OperatingTimeInfo[] | null;
}
