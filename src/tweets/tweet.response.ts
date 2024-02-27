import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { Tweet } from './entities/tweet.entity';

export const GqlTweetResponse = generateGqlResponseType(Tweet);
export const GqlTweetsResponse = generateGqlResponseType(Array(Tweet));
