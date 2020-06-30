import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RCommandQE, RCommandQEReturnType } from './rcqe.command';
import { RCQEvent } from './rcqe.event';
import { RCQueryE, RCQueryEReturnType } from './rcqe.query';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class RCQEService {
  constructor(
    @Inject('RCQE_CLIENTS_MAP')
    private readonly clients: Map<string, ClientProxy>,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  getClientProxy(name: string): ClientProxy {
    const clientProxy: ClientProxy | undefined = this.clients.get(name);

    if (!clientProxy) {
      throw new ConflictException(
        `RCQE Service doesn't found registered ClientProxy by name '${name}'`,
      );
    }

    return clientProxy;
  }

  async emit(event: RCQEvent): Promise<void> {
    if (event.queue) {
      return this.getClientProxy(event.queue)
        .emit(event.label, await event.serialize())
        .toPromise();
    }

    return this.eventBus.publish(event);
  }

  async exec<
    C extends RCommandQE<T>,
    T extends object | void = RCommandQEReturnType<C>
  >(command: C): Promise<T> {
    if (command.queue) {
      return this.getClientProxy(command.queue)
        .send(command.label, await command.serialize())
        .toPromise();
    }

    return this.commandBus.execute(command);
  }

  async ask<
    Q extends RCQueryE<T>,
    T extends object = RCQueryEReturnType<Q>
  >(query: Q): Promise<T> {
    if (query.queue) {
      return this.getClientProxy(query.queue)
        .send(query.label, await query.serialize())
        .toPromise();
    }

    return this.queryBus.execute(query);
  }
}
