import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSessionInput {
  @Field()
  fcmToken: string;

  @Field()
  device: string;

  @Field({ nullable: true })
  userId: string;

  @Field({ nullable: true })
  refreshToken: string;
}
