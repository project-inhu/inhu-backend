import { WEEKS } from '../common/constants/weeks.constant';

export type Week = (typeof WEEKS)[keyof typeof WEEKS];
