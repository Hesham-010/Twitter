import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { DeviceEnum, Lang } from 'src/user/user.enums';

@InputType()
export class SetLastActiveDetailsInput {
  @IsNotEmpty()
  @IsEnum(DeviceEnum)
  @Field()
  device: DeviceEnum;

  @IsNotEmpty()
  @IsEnum(Lang)
  @Field()
  lang: Lang;

  @IsOptional()
  @Field((type) => String, { nullable: true })
  platformDetails?: string;
}
