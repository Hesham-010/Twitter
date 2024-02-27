import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { Session } from './models/session.model';

export const GqlSessionsResponse = generateGqlResponseType(
  Array(Session),
  true,
);
