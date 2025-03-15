import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../src/api/user/user.repository';
import { PrismaService } from 'src/common/module/prisma/prisma.service';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, PrismaService],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a user successfully', async () => {
    const snsId = 'test123';
    const provider = 'kakao';

    const user = await userRepository.insertUser(snsId, provider);
    expect(user).toHaveProperty('idx');
    expect(user).toHaveProperty('nickname');
    expect(user.userProvider).toHaveProperty('snsId', snsId);
  });
});
