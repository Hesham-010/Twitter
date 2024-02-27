import { Field, ObjectType } from '@nestjs/graphql';
import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { User } from 'src/user/models/user.model';

@ObjectType()
export class Login {
  @Field(() => User)
  user: User;

  @Field()
  token: string;

  @Field()
  refreshToken: string;
}

export const GqlLoginResponse = generateGqlResponseType(Login);
