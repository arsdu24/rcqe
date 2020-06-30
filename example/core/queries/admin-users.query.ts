import {IUser} from "../../sdk";
import { RCQueryE } from '../../../src';

export class AdminUsersQuery extends RCQueryE<IUser[]> {

    constructor(
      readonly limit: number = 12,
      readonly skip: number = 0
    ) {
        super( `${process.env.RMQ_AUTORESPONDER_QUEUE}`);
    }

    serialize(): object {
        const { skip, limit } = this;

        return { skip, limit };
    }
}
