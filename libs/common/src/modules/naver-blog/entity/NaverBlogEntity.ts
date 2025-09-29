export class NaverBlogEntity {
  blogName: string;
  title: string;
  /**
   * description metadata
   */
  description: string | null;

  /**
   * 블로그 본문
   */
  contents: string | null;

  /**
   * 링크
   */
  url: string;

  /**
   * 작성자 이름
   */
  authorName: string;

  /**
   * 작성자 프로필 이미지
   */
  authorProfileImageUrl: string | null;

  thumbnailImageUrl: string | null;

  uploadedAt: Date;
}
