import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { Follow } from './entities/follow.entity';

export const GqlFollowResponse = generateGqlResponseType(Follow);
export const GqlFollowsResponse = generateGqlResponseType(Array(Follow));
