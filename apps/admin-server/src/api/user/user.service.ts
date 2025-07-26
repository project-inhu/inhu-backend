import { GetAllUsersInput, UserCoreService } from '@libs/core';
import { Injectable } from '@nestjs/common';
import { GetUserOverviewAllDto } from './dto/request/get-user-overview-all.dto';
import { UserOverviewEntity } from './entity/user-overview.entity';

@Injectable()
export class UserService {
  constructor(private readonly userCoreService: UserCoreService) {}

  public async getUserAll(
    getUserOverviewDto: GetUserOverviewAllDto,
  ): Promise<{ userList: UserOverviewEntity[]; count: number }> {
    const input: GetAllUsersInput = {
      take: 10,
      skip: (getUserOverviewDto.page - 1) * 10,
    };

    const users = await this.userCoreService.getUserAll(input);

    return {
      userList: users.map(UserOverviewEntity.fromModel),
      count: await this.userCoreService.getUserOverviewCount(),
    };
  }
}
