import { Field, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Column,
  ForeignKey,
  PrimaryKey,
  Table,
  Model,
  DataType,
} from 'sequelize-typescript';
import { User } from 'src/user/models/user.model';
import { v4 as uuid } from 'uuid';

@ObjectType()
@Table
export class Follow extends Model {
  @PrimaryKey
  @Column
  @Column({
    type: DataType.UUID,
    defaultValue: () => uuid(),
  })
  @Field()
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  @Field()
  followerId: string;

  @Column({
    type: DataType.UUID,
  })
  @Field()
  @ForeignKey(() => User)
  followingId: string;

  @BelongsTo(() => User)
  user: User;
}
