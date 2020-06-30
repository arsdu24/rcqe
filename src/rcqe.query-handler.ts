import { RCQueryE, RCQueryEReturnType } from './rcqe.query';

export interface IRCQueryEHandler<Q extends RCQueryE<object>> {
    resolve(query: Q): Promise<RCQueryEReturnType<Q>>;
}
