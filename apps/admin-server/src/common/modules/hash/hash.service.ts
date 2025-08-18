import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class HashService {
  constructor() {}

  public async hash(str: string): Promise<string> {
    const salt = await genSalt(10);

    return await hash(str, salt);
  }

  public async compare(str: string, hash: string): Promise<boolean> {
    return await compare(str, hash);
  }
}
