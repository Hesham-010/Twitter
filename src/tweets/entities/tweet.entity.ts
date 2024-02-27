import { Field, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { paginate } from 'src/_common/pagination/paginate';
import { File } from 'src/_common/upload/models/file.model';
import { User } from 'src/user/models/user.model';

@ObjectType()
@Table({
  tableName: 'Tweets',
})
export class Tweet extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Field()
  @Column({
    type: DataType.UUID,
  })
  id: string;

  @Field()
  @Column
  content: string;

  @ForeignKey(() => File)
  @Column({
    type: DataType.UUID,
  })
  @Field({ nullable: true })
  tweetFile: string;

  @HasOne(() => File, 'tweetfile')
  file: File;

  @Field()
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

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
