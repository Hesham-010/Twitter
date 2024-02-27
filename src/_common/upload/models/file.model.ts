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
import { User } from 'src/user/models/user.model';
import { FileUseCases } from '../file-useCase.enum';
import { Tweet } from 'src/tweets/entities/tweet.entity';

@Table({
  tableName: 'Files',
})
@ObjectType()
export class File extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  id: string;

  @Column
  @Field()
  filePath: string;

  @Column({
    type: DataType.ENUM(...Object.values(FileUseCases)),
  })
  @Field()
  FileUseCase: FileUseCases;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  @Field()
  userId: string;

  @BelongsTo(() => User)
  @Field(() => User)
  user: User;
}
