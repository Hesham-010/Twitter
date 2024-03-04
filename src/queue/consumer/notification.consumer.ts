import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import * as FCM from 'fcm-node';
import { IRepository } from 'src/_common/database/buildRepository.interface';
import { Repositories } from 'src/_common/database/database-repository.enum';
import { Session } from 'src/session/models/session.model';

@Processor('notification')
export class NotificationConsumer {
  constructor(
    @Inject(Repositories.SessionsRepository)
    private readonly sessionRepo: IRepository<Session>,
  ) {}

  @Process()
  async sendNotification(job: Job) {
    try {
      const { title, body, userIds } = job.data;
      const serverKey = process.env.SERVER_KEY;

      const fcm = new FCM(serverKey);

      const sessions = await this.sessionRepo.findAll({
        where: {
          userId: userIds,
          notificationAllowed: true,
        },
      });

      const reg_Ids = [];
      sessions.forEach((session) => {
        reg_Ids.push(session.fcmToken);
      });

      if (reg_Ids.length > 0) {
        const message = {
          registration_ids: reg_Ids,
          content_available: true,
          mutable_content: true,
          notification: {
            title,
            body,
            sound: 'default',
            click_action: 'FCM_PLUGIN_ACTIVITY',
            icon: 'fcm_push_icon',
          },
        };

        fcm.send(message, async (err, response) => {
          if (response) {
            console.log('Success');
          } else {
            return err;
          }
        });
      }
    } catch (err) {
      console.log('errs', err);
    }
  }
}
