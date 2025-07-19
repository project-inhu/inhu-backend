import { faker } from '@faker-js/faker/.';
import { defaultValue, pickRandomValue, SeedOutput } from '@libs/common';
import { AUTH_PROVIDER } from '@libs/core';
import { ISeedHelper } from '@libs/testing/interface/seed-helper.interface';
import { UserSeedInput } from '@libs/testing/seed/user/type/user-seed.input';
import { UserSeedOutput } from '@libs/testing/seed/user/type/user-seed.output';

export class UserSeedHelper extends ISeedHelper<UserSeedInput, UserSeedOutput> {
  public async seed(input: UserSeedInput): Promise<UserSeedOutput> {
    const requiredInput = this.generateFilledInputValue(input);

    const createdUser = await this.prisma.user.create({
      select: { idx: true },
      data: {
        nickname: requiredInput.nickname,
        profileImagePath: requiredInput.profileImagePath,
        isAdmin: requiredInput.isAdmin,
        userProvider: requiredInput.social
          ? {
              create: {
                name: requiredInput.social.provider,
                snsId: requiredInput.social.snsId,
              },
            }
          : undefined,
      },
    });

    return { idx: createdUser.idx, ...requiredInput };
  }

  public generateFilledInputValue(
    input: UserSeedInput,
  ): SeedOutput<UserSeedInput> {
    return {
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
      isAdmin: defaultValue(input.isAdmin, false),
      social: defaultValue(
        {
          provider: defaultValue(
            input.social?.provider,
            pickRandomValue(AUTH_PROVIDER),
          ),
          snsId: defaultValue(input.social?.snsId, faker.string.uuid()),
        },
        null,
      ),
      deletedAt: defaultValue(input.deletedAt, null),
    };
  }
}
