import { AdminUsersQuery } from '../../core/queries';
import { IUser } from '../../sdk/interfaces/entities';
import { HandleQuery, IRCQueryEHandler } from '../../../src';

@HandleQuery(AdminUsersQuery)
export class AdminUsersQueryHandler
  implements IRCQueryEHandler<AdminUsersQuery> {
  async resolve(query: AdminUsersQuery): Promise<IUser[]> {
    return Array(query.limit)
      .fill(0)
      .map((o, i) => ({
        login: `${query.skip}:${i}-login`,
        password: `${query.skip}:${i}-password`,
        id: `${query.skip}:${i}-id`,
      }));
  }
}
