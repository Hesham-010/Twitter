import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { Tweet } from './models/tweet.model';

export const GqlTweetResponse = generateGqlResponseType(Tweet);
export const GqlTweetsResponse = generateGqlResponseType(Array(Tweet));
