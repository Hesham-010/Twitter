import { Field, ObjectType } from '@nestjs/graphql';
import { Model } from 'sequelize';
import { User } from 'src/user/models/user.model';
import { ModelWhichUploadedFor } from '../upload.type';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@ObjectType()
@Table({
  tableName: 'files',
})
export class File extends Model {
  @PrimaryKey
  @Column
  @Default(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column
  @Field()
  filePath: string;

  @AllowNull(false)
  @Column
  encoding?: string;

  @AllowNull(false)
  @Column
  mimetype?: string;

  @AllowNull(true)
  @Column
  sizeInBytes?: number;

  @AllowNull(true)
  @ForeignKey(() => User)
  @Column
  @Field(() => User)
  uploadedById: string;

  @BelongsTo(() => User)
  uploadedBy: User;
}
