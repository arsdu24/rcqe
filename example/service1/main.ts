import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}/${process.env.RABBITMQ_DEFAULT_VHOST}`,
        ],
        queue: `${process.env.RMQ_AUTORESPONDER_QUEUE}`,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
