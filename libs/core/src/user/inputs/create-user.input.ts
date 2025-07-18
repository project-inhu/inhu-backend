export class CreateUserInput {
  nickname: string;
  profileImagePath: string | null;
  snsId?: string;
  provider?: string;
}
