import { Injectable } from '@nestjs/common';
import { DayOfWeek } from 'src/common/module/date-util/constants/day.constants';

@Injectable()
export class DateUtilService {
  constructor() {}

  /**
   * 현재 날짜를 기준으로 오늘 날짜를 반환하는 메서드
   *
   * @returns {Date} 오늘 날짜
   */
  public getNow(): Date {
    return new Date();
  }

  /**
   * 오늘에 해당하는 요일을 가져오는 메서드
   */
  public getTodayDayOfWeek(): DayOfWeek {
    const today = this.getNow();
    return today.getDay() as DayOfWeek;
  }

  /**
   * 오늘 날짜가 이번 달에서 몇 번째 해당 요일인지 반환하는 메서드
   * 예: 2024-06-20이 목요일이고, 6월의 세 번째 목요일이면 3 반환
   */
  public getTodayNthDayOfWeekInMonth(): number {
    const today = this.getNow();
    const dayOfWeek = today.getDay();
    const date = today.getDate();

    // 이번 달 1일부터 오늘까지 해당 요일이 몇 번 나왔는지 센다
    let count = 0;
    for (let d = 1; d <= date; d++) {
      const current = new Date(today.getFullYear(), today.getMonth(), d);
      if (current.getDay() === dayOfWeek) {
        count++;
      }
    }
    return count;
  }
}
