import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminAuth } from '@admin/common/decorator/admin-auth.decorator';
import { GetUserOverviewAllDto } from './dto/request/get-user-overview-all.dto';
import { GetUserOverviewAllResponseDto } from './dto/response/get-user-overview-all-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 목록 조회 Endpoint
   */
  @Get()
  @AdminAuth()
  public async getUserOverviewAll(
    @Query() getUserOverviewDto: GetUserOverviewAllDto,
  ): Promise<GetUserOverviewAllResponseDto> {
    return await this.userService.getUserAll(getUserOverviewDto);
  }
}
