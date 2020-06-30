import { Class } from 'utility-types';
import { EventsHandler } from '@nestjs/cqrs';
import { EventPattern } from '@nestjs/microservices';
import { RCQEvent } from '../rcqe.event';
import { IRCQEventHandler } from '../rcqe.event-handler';
import { RCQEController } from '../rcqe.controller';

export function HandleEvent<Q extends RCQEvent>(event: Class<Q>) {
  return <H extends IRCQEventHandler<any>>(target: Class<H>) => {
    let instance: any;
    const handleMethod: string = 'handle';
    const eventLabel: string = (event as any).getLabel();

    EventsHandler(event)(target);

    Object.defineProperty(RCQEController.prototype, eventLabel, {
      value: (...args: any[]) => {
        if (instance) {
          return instance[handleMethod](...args);
        }
      },
      configurable: false,
      writable: false,
    });

    const descriptor: TypedPropertyDescriptor<any> =
      Object.getOwnPropertyDescriptor(RCQEController.prototype, eventLabel) ||
      {};
    const metadataKey = 'design:paramtypes';

    Reflect.defineMetadata(
      metadataKey,
      Reflect.getMetadata(metadataKey, target.prototype, handleMethod),
      RCQEController.prototype,
      eventLabel,
    );

    EventPattern(eventLabel)(RCQEController.prototype, eventLabel, descriptor);

    // @ts-ignore
    return class extends target {
      constructor(...args: any[]) {
        super(...args);

        instance = this;
      }
    };
  };
}
