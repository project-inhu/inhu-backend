import { SelectAdminAccount } from '@libs/core/admin-account/model/prisma-type/select-admin-account';

export class AdminAccountModel {
  /**
   * 사용자 인덱스
   */
  public idx: number;

  /**
   * 관리자 아이디
   */
  public id: string;

  /**
   * 관리자 비밀번호
   */
  public pw: string;

  constructor(data: AdminAccountModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(account: SelectAdminAccount): AdminAccountModel {
    return new AdminAccountModel({
      idx: account.idx,
      id: account.id,
      pw: account.pw,
    });
  }
}
