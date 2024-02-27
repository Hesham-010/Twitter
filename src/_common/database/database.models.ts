import { User } from 'src/user/models/user.model';
import { plural } from 'pluralize';
import { buildRepository } from './buildRepository';
import { Tweet } from 'src/tweets/entities/tweet.entity';
import { Session } from 'src/session/models/session.model';
import { Follow } from 'src/follow/entities/follow.entity';
import { SecurityGroup } from 'src/security-group/models/security-group.model';
import { UserVerificationCode } from 'src/user/models/user-verification-code.model';
import { File } from 'src/_common/upload/models/file.model';

export const models = [
  User,
  Tweet,
  Session,
  Follow,
  SecurityGroup,
  UserVerificationCode,
  File,
];

export const repositories = models.map((m) => ({
  provide: `${plural(m.name)}Repository`,
  useClass: buildRepository(m),
}));
