interface PlaceOverviewQueryResult {
  idx: number;
  name: string;
  address: string;
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
