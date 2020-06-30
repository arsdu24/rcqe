import { RCQEvent } from './rcqe.event';

export interface IRCQEventHandler<Q extends RCQEvent> {
  handle(query: Q): Promise<void>;
}
