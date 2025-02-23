import { Decimal } from '@prisma/client/runtime/library';

export interface PlaceQueryResult {
  idx: number;
  name: string;
  tel: string;
  address: string;
  addressX: Decimal;
  addressY: Decimal;
  createdAt: Date;
  placeHours: {
    day: string;
    startAt: Date | null;
    endAt: Date | null;
  }[];
  bookmark: {
    idx: number;
  }[];
  placeImage: {
    imagePath: string | null;
  }[];
  review: {
    idx: number;
  }[];
}
