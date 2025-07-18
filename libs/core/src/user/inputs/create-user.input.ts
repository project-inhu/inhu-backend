export class CreateUserInput {
  nickname: string;
  profileImagePath: string | null;
  social?: {
    snsId: string;
    provider: string;
  };
}
