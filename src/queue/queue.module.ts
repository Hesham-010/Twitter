import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from './services/sendEmail.service';
import { NotificationConsumer } from './consumer/notification.consumer';
import { NotificationResolver } from './resolvers/sendEmail.resolver';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  providers: [NotificationConsumer, NotificationService, NotificationResolver],
})
export class QueueModule {}
