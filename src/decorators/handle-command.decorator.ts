import 'reflect-metadata';
import { Class } from 'utility-types';
import { RCommandQE, RCommandQEReturnType } from '../rcqe.command';
import { CommandHandler } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { IRCommandQEHandler } from '../rcqe.command-handler';
import { RCQEController } from '../rcqe.controller';

export function HandleCommand<C extends RCommandQE<T>, T extends object | void = RCommandQEReturnType<C>>(command: Class<C>) {
    return <H extends IRCommandQEHandler<any>>(target: Class<H>) => {
      let instance: any;
      const handleMethod: string = 'execute'
      const commandLabel: string = (command as any).getLabel();

      CommandHandler(command)(target);

      Object.defineProperty(RCQEController.prototype, commandLabel, {
        value: (...args: any[]) => {
          if (instance) {
            return instance[handleMethod](...args)
          }
        },
        configurable: false,
        writable: false
      })

      const descriptor: TypedPropertyDescriptor<any> = Object.getOwnPropertyDescriptor(RCQEController.prototype, commandLabel) || {}
      const metadataKey = 'design:paramtypes';

      Reflect.defineMetadata(
        metadataKey,
        Reflect.getMetadata(
          metadataKey,
          target.prototype,
          handleMethod
        ),
        RCQEController.prototype,
        commandLabel
      )

      MessagePattern(commandLabel)(
        RCQEController.prototype,
        commandLabel,
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