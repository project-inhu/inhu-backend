export class CreateBlogReviewInput {
  public blogName: string;
  public title: string;
  public description: string | null;
  public contents: string | null;
  public authorName: string;
  public authorProfileImagePath: string | null;
  public thumbnailImagePath: string | null;
  public url: string;
  public blogType: 0;
  public uploadedAt: Date;
}
