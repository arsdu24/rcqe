import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

import { Transport } from '@nestjs/microservices';
import { RCQEModule } from '../../src';

@Module({
  imports: [
    RCQEModule.register(
      [
        `${process.env.RMQ_COMMANDS_QUEUE}`,
        `${process.env.RMQ_QUERIES_QUEUE}`,
        `${process.env.RMQ_EVENTS_QUEUE}`,
      ].map(queue => ({
        name: queue,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/${process.env.RABBITMQ_DEFAULT_VHOST}`,
          ],
          queue,
          queueOptions: {
            durable: true,
          },
        },
      })),
    ),
  ],
  controllers: [UserController],
})
export class AppModule {}
