import { User } from 'src/user/models/user.model';
import { Lang } from 'src/user/user.enums';
import { Timezone } from './graphql-response.type';
import { IDataLoaders } from '../dataLoader/dataLoader.interface';

export interface IContext {
  currentUser?: User;
  sessionId?: string;
  req: Request;
  lang: Lang;
  country: string;
  timezone: Timezone;
  loaders: IDataLoaders;
}
