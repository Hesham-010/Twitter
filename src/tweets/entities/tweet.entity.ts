import { Field, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/models/user.model';
import { paginate } from 'src/_common/pagination/paginate';
import { v4 as uuid } from 'uuid';

@ObjectType()
@Table
export class Tweet extends Model {
  @PrimaryKey
  @Field()
  @Column({
    type: DataType.UUID,
    defaultValue: () => uuid(),
  })
  id: string;

  @Field()
  @Column
  content: string;

  @Field()
  @Column
  tweetImage: string;

  @Field()
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  static async paginate(page, limit) {
    return paginate(this, page, limit);
  }
}
