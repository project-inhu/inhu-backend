/**
 * @publicApi
 */
export class CreateMagazineInput {
  title: string;
  description: string | null;
  content: string;
  thumbnailImagePath: string | null;
  isTitleVisible: boolean;
  placeIdxList: number[] | null;
}
