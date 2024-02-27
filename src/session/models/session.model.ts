import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { User } from 'src/user/models/user.model';
import { DeviceEnum } from 'src/user/user.enums';

@ObjectType()
@Table({
  tableName: 'sessions',
})
export class Session extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  @Field(() => ID)
  id: string;

  @Column
  @Field()
  refreshToken: string;

  @Column
  @Field()
  expireDate: Date;

  @Column({
    defaultValue: true,
  })
  @Field()
  notificationAllowed: boolean;

  @AllowNull(false)
  @Field()
  @Column({ type: DataType.ENUM(...Object.values(DeviceEnum)) })
  device: DeviceEnum;

  @Unique
  @AllowNull(true)
  @Column
  @Field()
  fcmToken: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  @Field()
  userId: string;

  @BelongsTo(() => User, 'userId')
  user: User;
}
