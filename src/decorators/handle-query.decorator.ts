import { Class } from 'utility-types';
import { CommandHandler } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { RCQueryE, RCQueryEReturnType } from '../rcqe.query';
import { IRCQueryEHandler } from '../rcqe.query-handler';
import { RCQEController } from '../rcqe.controller';

export function HandleQuery<Q extends RCQueryE<T>, T extends object = RCQueryEReturnType<Q>>(query: Class<Q>) {
    return <H extends IRCQueryEHandler<Q>>(target: Class<H>) => {
      let instance: any;
      const handleMethod: string = 'resolve';
      const queryLabel: string = (query as any).getLabel();

      CommandHandler(query)(target);

      Object.defineProperty(RCQEController.prototype, queryLabel, {
        value: (...args: any[]) => {
          if (instance) {
            return instance[handleMethod](...args)
          }
        },
        configurable: false,
        writable: false
      })

      const descriptor: TypedPropertyDescriptor<any> = Object.getOwnPropertyDescriptor(RCQEController.prototype, queryLabel) || {}
      const metadataKey = 'design:paramtypes';

      Reflect.defineMetadata(
        metadataKey,
        Reflect.getMetadata(
          metadataKey,
          target.prototype,
          handleMethod
        ),
        RCQEController.prototype,
        queryLabel
      )

      MessagePattern(queryLabel)(
        RCQEController.prototype,
        queryLabel,
        descriptor
      );

      // @ts-ignore
      return class extends target {
        constructor(...args: any[]) {
          super(...args);

          instance = this;
        }
      }
    }
}