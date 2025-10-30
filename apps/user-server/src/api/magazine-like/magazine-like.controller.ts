import {
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MagazineLikeService } from './magazine-like.service';
import { Exception } from '@libs/common/decorator/exception.decorator';
import { LoginAuth } from '@user/common/decorator/login-auth.decorator';
import { LoginUser } from '@user/common/types/LoginUser';
import { User } from '@user/common/decorator/user.decorator';
import { MagazineLikeEntity } from './entity/magazine-like.entity';

@Controller()
@ApiTags('Magazine Like')
export class MagazineLikeController {
  constructor(private readonly magazineLikeService: MagazineLikeService) {}

  @Post('magazine/:idx/like')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found for idx: {idx}')
  @Exception(409, 'Magazine like already exists')
  @HttpCode(200)
  @LoginAuth()
  public async likeMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser: LoginUser,
  ): Promise<MagazineLikeEntity> {
    return await this.magazineLikeService.likeMagazineByIdx(loginUser, idx);
  }

  @Delete('magazine/:idx/like')
  @Exception(400, 'Invalid magazine idx')
  @Exception(404, 'Magazine not found for idx: {idx}')
  @HttpCode(200)
  @LoginAuth()
  public async unlikeMagazineByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser: LoginUser,
  ): Promise<void> {
    return await this.magazineLikeService.unlikeMagazineByIdx(loginUser, idx);
  }
}
