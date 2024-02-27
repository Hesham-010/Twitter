import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field()
  @Min(1)
  page?: number;

  @Field()
  @Min(1)
  limit?: number;
}

@ArgsType()
export class Paginate {
  paginate?: PaginationInput;
}
