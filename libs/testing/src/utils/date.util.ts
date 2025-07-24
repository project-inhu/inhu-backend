import { DayOfWeek } from '@libs/common';

export class DateUtil {
  constructor(private readonly date: Date) {
    // !주의: 어떤 메서드도 date 객체의 속성을 건드려서는 안 됩니다.
  }

  public after(time: `${number}h`): Date {
    const date = new Date(this.date);
    date.setHours(this.date.getHours() + Number(time.replace('h', '')));
    return date;
  }

  public before(time: `${number}h`): Date {
    const date = new Date(this.date);
    date.setHours(this.date.getHours() - Number(time.replace('h', '')));
    return date;
  }

  public day(): DayOfWeek {
    return this.date.getDay() as DayOfWeek;
  }

  public dayAfter(after: number): DayOfWeek {
    const tomorrowDay = this.date.getDay() + after;

    if (tomorrowDay > 6) {
      return 0; // Wrap around to Sunday
    }
    return tomorrowDay as DayOfWeek;
  }

  public dateAfter(after: number): Date {
    const date = new Date(this.date);
    date.setDate(this.date.getDate() + after);
    return date;
  }

  public dateBefore(before: number): Date {
    const date = new Date(this.date);
    date.setDate(this.date.getDate() - before);
    return date;
  }

  /**
   * 같은 날짜에 특정 시간으로 설정된 새로운 Date 객체를 반환합니다.
   */
  public new(time?: `${number}:${number}`): Date {
    if (!time) {
      return new Date(this.date);
    }

    const [hour, minute] = time.split(':').map(Number);
    const newDate = new Date(this.date);
    newDate.setHours(hour, minute, 0, 0); // Set hours and minutes
    return newDate;
  }
}
