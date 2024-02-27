// import { Injectable } from '@nestjs/common';
// import { Queue } from 'bull';
// import { InjectQueue } from '@nestjs/bull';

// @Injectable()
// export class NotificationService {
//   constructor(@InjectQueue('notification') private notificationQueue: Queue) {}

//   async sendNotification(title, body, userIds) {
//     await this.notificationQueue.add({ title, body, userIds });
//   }
// }
