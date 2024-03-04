import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Session } from 'src/session/models/session.model';
import { Follow } from 'src/follow/models/follow.model';
import { Tweet } from 'src/tweets/models/tweet.model';
import { paginate } from 'src/_common/pagination/paginate';
import { SecurityGroup } from 'src/security-group/models/security-group.model';
import { Gender, Lang, UserRole } from '../user.enums';
import { LastLoginDetails } from '../user.type';
import { UserVerificationCode } from './user-verification-code.model';
// import { File } from 'src/_common/upload/models/file.model';

@ObjectType()
@Table({
  timestamps: true,
  tableName: 'Users',
  indexes: [{ fields: [{ name: 'role' }, { name: 'isBlocked' }] }],
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  @Field(() => ID)
  id: string;

  @AllowNull(false)
  @Column
  @Field()
  firstName: string;

  @AllowNull(false)
  @Column
  @Field()
  lastName: string;

  @AllowNull(false)
  @Column
  @Field()
  fullName: string;

  @Unique
  @AllowNull(false)
  @Column
  @Field()
  slug: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  bio?: string;

  @AllowNull(true)
  @Column
  notVerifiedPhone?: string;

  @Unique
  @AllowNull(true)
  @Column
  @Field({ nullable: true })
  verifiedPhone?: string;

  @Column
  @Field()
  email: string;

  @AllowNull(true)
  @Column
  password: string;

  @AllowNull(false)
  @Column
  @Field()
  country: string;

  @Default(Gender.MALE)
  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(Gender)) })
  @Field()
  gender: Gender;

  @Default(UserRole.USER)
  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(UserRole)) })
  @Field()
  role: UserRole;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  profilePicture?: string;

  @Default(false)
  @AllowNull(false)
  @Column
  @Field()
  isBlocked: boolean;

  @Default(Lang.EN)
  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(Lang)) })
  @Field()
  favLang: Lang;

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  @Field(() => LastLoginDetails, { nullable: true })
  lastLoginDetails: LastLoginDetails;

  @HasMany(() => Tweet)
  tweets: Tweet[];

  @HasMany(() => Follow)
  follow: Follow[];

  @HasMany(() => Follow)
  following: Follow[];

  @HasMany(() => Session)
  session: Session[];

  // @HasMany(() => File)
  // file: File[];

  @HasMany(() => UserVerificationCode)
  UserVerificationCode: UserVerificationCode[];

  @AllowNull(true)
  @ForeignKey(() => SecurityGroup)
  @Column({ type: DataType.UUID, onDelete: 'SET NULL', onUpdate: 'SET NULL' })
  securityGroupId?: string;

  @BelongsTo(() => SecurityGroup)
  @Field(() => SecurityGroup, { nullable: true })
  securityGroup?: SecurityGroup;

  static async paginate(
    page: number = 1,
    limit: number = 15,
    filter = {},
    sort = '-createdAt',
    include = [],
  ) {
    return paginate<User>(this, page, limit, filter, sort, include);
  }
}
