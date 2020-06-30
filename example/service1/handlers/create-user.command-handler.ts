import { CreateUserCommand } from '../../core/commands';
import { IUser } from '../../sdk/interfaces/entities';
import { HandleCommand, IRCommandQEHandler } from '../../../src';

@HandleCommand(CreateUserCommand)
export class CreateUserCommandHandler implements IRCommandQEHandler<CreateUserCommand> {
    async execute(command: CreateUserCommand): Promise<IUser> {
        return {
            id: 'yes',
            ...command.plain
        }
    }
}