import { WEEKS } from '../common/constants/weeks.constant';

/**
 * 요일을 나타내는 타입 정의
 */
export type OperatingWeekDay = (typeof WEEKS)[keyof typeof WEEKS];
