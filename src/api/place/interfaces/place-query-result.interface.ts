interface PlaceQueryResult {
  idx: number;
  name: string;
  tel: string;
  address: string;
  addressX: number;
  addressY: number;
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
