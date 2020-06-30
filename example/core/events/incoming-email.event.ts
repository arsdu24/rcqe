import {IIncomingEmail} from "../../sdk";
import { RCQEvent } from '../../../src';

export class IncomingEmailEvent extends RCQEvent {
    constructor(
        readonly incomingEmail: IIncomingEmail
    ) {
        super(`${process.env.RMQ_AUTORESPONDER_QUEUE}`);
    }

    serialize(): object {
        return this.incomingEmail
    }
}
