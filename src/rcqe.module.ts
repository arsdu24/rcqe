import { Controller, DynamicModule, Module, Provider } from '@nestjs/common';
import { RCQEService } from './rcqe.service';
import { ClientsModuleOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { RCQEController } from './rcqe.controller';

@Module({})
export class RCQEModule {
  static register(connections: ClientsModuleOptions): DynamicModule {
    const connectionNames: string[] = connections.map(({ name }) => name)
    const providers: Provider[] = [
      {
        provide: 'RCQE_CLIENTS_MAP',
        useFactory: (...connections) => new Map<string, ClientProxy>(
          connections
            .map((client: ClientProxy, index: number): { name?: string, client: ClientProxy } => ({
              client,
              name: connectionNames[index]
            }))
            .filter((entry: { name?: string, client: ClientProxy }): entry is  { name: string, client: ClientProxy } => {
              return !!entry.name
            })
            .map(({name,client }) => [name, client])
        ),
        inject: connectionNames
      },
      RCQEService,
    ];

    return {
      global: true,
      imports: [
        ClientsModule.register(connections),
        CqrsModule
      ],
      providers,
      exports: [...providers],
      controllers: [Controller()(RCQEController) || RCQEController],
      module: RCQEModule
    }
  }
}