import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/api/user/entity/user.entity';
import { UserController } from 'src/api/user/user.controller';
import { UserService } from 'src/api/user/user.service';
import { AuthGuard } from 'src/auth/common/guards/auth.guard';
import { AuthService } from 'src/auth/services/auth.service';
import { LoginTokenService } from 'src/auth/services/login-token.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const mockUserService = {
      getMyInfo: jest.fn(),
      updateMyInfo: jest.fn(),
      deleteUser: jest.fn(),
    };

    const mockAuthGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const mockLoginTokenService = {
      validateToken: jest.fn().mockReturnValue({ idx: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthGuard, useValue: mockAuthGuard },
        { provide: LoginTokenService, useValue: mockLoginTokenService },
        { provide: AuthService, useValue: {} },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getMyInfoByUserIdx', () => {
    if ('should return my info', async () => {
      const mockUser: UserEntity = { idx: 1, nickname: 'TestUser' };

      userService.getMyInfo = jest.fn().mockResolvedValue(mockUser);
    })
  })
});
