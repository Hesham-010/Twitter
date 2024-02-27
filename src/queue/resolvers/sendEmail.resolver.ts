// import { Args, Mutation, Resolver } from '@nestjs/graphql';
// import { NotificationService } from '../services/sendEmail.service';

// @Resolver()
// export class NotificationResolver {
//   constructor(private readonly notificationService: NotificationService) {}

//   @Mutation(() => String)
//   sendNotification(
//     @Args('title') title: string,
//     @Args('body') body: string,
//     @Args('userIds', { type: () => [String] }) userIds: string[],
//   ) {
//     return this.notificationService.sendNotification(title, body, userIds);
//   }
// }
