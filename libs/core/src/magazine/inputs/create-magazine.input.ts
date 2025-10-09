/**
 * @publicApi
 */
export class CreateMagazineInput {
  title: string;
  content: string;
  thumbnailImagePath: string | null;
  isTitleVisible: boolean;
  placeIdxList: number[] | null;
}
