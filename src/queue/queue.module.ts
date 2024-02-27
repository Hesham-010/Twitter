// import { Module } from '@nestjs/common';
// import { BullModule } from '@nestjs/bull';
// import { NotificationService } from './services/sendEmail.service';

// @Module({
//   imports: [
//     BullModule.forRoot({
//       redis: {
//         host: 'localhost',
//         port: 6379,
//       },
//     }),
//     BullModule.registerQueue({
//       name: 'notification',
//     }),
//   ],
//   providers: [NotificationConsumer, NotificationService, NotificationResolver],
// })
// export class QueueModule {}
