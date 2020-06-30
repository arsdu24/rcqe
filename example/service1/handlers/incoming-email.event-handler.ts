import { IncomingEmailEvent } from '../../core/events';
import { HandleEvent, IRCQEventHandler } from '../../../src';

@HandleEvent(IncomingEmailEvent)
export class IncomingEmailEventHandler implements IRCQEventHandler<IncomingEmailEvent> {
  async handle(query: IncomingEmailEvent): Promise<void> {
    console.log(query)
  }
}