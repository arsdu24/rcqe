import { Controller, Get } from '@nestjs/common';
import { IIncomingEmail, IUser } from '../sdk/interfaces/entities';
import { AdminUsersQuery } from '../core/queries';
import { CreateUserCommand, ICreateUser } from '../core/commands';
import { IncomingEmailEvent } from '../core/events';
import { RCQEService } from '../../src';

@Controller()
export class UserController {
  constructor(private readonly rcqeService: RCQEService) {}

  @Get('admin')
  async getAdminUsers(limit: number = 12, skip: number = 0): Promise<IUser[]> {
    return this.rcqeService.ask(new AdminUsersQuery(limit, skip));
  }

  @Get('create')
  async createUser(
    plain: ICreateUser = { password: 'pass', login: 'email' },
  ): Promise<IUser> {
    return this.rcqeService.exec(new CreateUserCommand(plain));
  }

  @Get('email')
  async emitIncomingEmail(
    email: IIncomingEmail = { id: 'D', from: 'Q', subject: 'S' },
  ): Promise<void> {
    return this.rcqeService.emit(new IncomingEmailEvent(email));
  }
}
