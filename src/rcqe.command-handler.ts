import { RCommandQE, RCommandQEReturnType } from './rcqe.command';

export interface IRCommandQEHandler<C extends RCommandQE<object | void>> {
    execute(command: C): Promise<RCommandQEReturnType<C>>;
}
