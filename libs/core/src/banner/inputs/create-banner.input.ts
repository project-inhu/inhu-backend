/**
 * CreateBannerInput 클래스
 *
 * @publicApi
 */
export class CreateBannerInput {
  name: string;
  imagePath: string;
  link: string | null;
  startAt: Date;
  endAt: Date | null;
  activatedAt: Date | null;
}
