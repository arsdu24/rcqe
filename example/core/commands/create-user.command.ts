import {IUser} from "../../sdk";
import { RCommandQE } from '../../../src';

export type ICreateUser = Omit<IUser, 'id'>

export class CreateUserCommand extends RCommandQE<IUser> {
    constructor(
        readonly plain: ICreateUser
    ) {
        super(`${process.env.RMQ_AUTORESPONDER_QUEUE}`);
    }

    serialize(): object {
        return this.plain;
    }
}
