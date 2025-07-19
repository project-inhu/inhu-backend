import { faker } from '@faker-js/faker/.';
import { DeepPartial, defaultValue, pickRandomValue } from '@libs/common';
import { AUTH_PROVIDER, CreateUserInput } from '@libs/core';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';

export class UserSeedHelper extends ISeedHelper<
  CreateUserInput,
  { idx: number }
> {
  public async seed(
    input: DeepPartial<CreateUserInput>,
  ): Promise<{ idx: number }> {
    return await this.prisma.user.create({
      select: { idx: true },
      data: {
        nickname: defaultValue(
          input.nickname,
          faker.word.noun({
            length: {
              min: 2,
              max: 8,
            },
          }),
        ),
        profileImagePath: defaultValue(
          input.profileImagePath,
          `/user-profile/${faker.string.uuid()}.png`,
        ),
        userProvider: {
          create: {
            name: defaultValue(
              input.social?.provider,
              pickRandomValue(AUTH_PROVIDER),
            ),
            snsId: defaultValue(input.social?.snsId, faker.string.uuid()),
          },
        },
      },
    });
  }
}
