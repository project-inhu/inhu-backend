import { UserOverviewEntity } from '../../entity/user-overview.entity';

export class GetUserOverviewAllResponseDto {
  public userList: UserOverviewEntity[];
  public count: number;
}
