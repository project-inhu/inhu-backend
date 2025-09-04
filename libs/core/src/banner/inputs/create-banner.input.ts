/**
 * CreateBannerInput 클래스
 *
 * @publicApi
 */
export class CreateBannerInput {
  name: string;
  imagPath: string;
  link: string | null;
  startAt: Date;
  endAt: Date | null;
}
