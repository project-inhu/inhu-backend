import { Injectable } from '@nestjs/common';
import { DayOfWeek } from './constants/day-of-week.constants';

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
   *
   * 한국 시간에 해당하는 오늘 날짜를 반환합니다.
   */
  public getTodayDayOfWeek(): DayOfWeek {
    const today = this.getNow();
    return today.getDay() as DayOfWeek;
  }

  /**
   * Date 객체를 한국 날짜로 변환하는 메서드
   *
   * 모든 데이터베이스는 UTC로 저장하지만,용
   * 시간 데이터는 한국 시간을 기준으로 변환하기 때문에 사용됩니다.
   */
  public transformKoreanDate(date: Date): `${number}-${string}-${string}` {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Date 객체를 한국 시간으로 반환하는 메서드
   *
   * 모든 데이터베이스는 UTC로 저장하지만,
   * 시간 데이터는 한국 시간을 기준으로 변환하기 때문에 사됩니다.
   */
  public transformKoreanTime(
    date: Date,
  ): `${string}:${string}:${string}.${string}Z` {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return `${hours}:${minutes}:${seconds}.${milliseconds}Z`;
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
