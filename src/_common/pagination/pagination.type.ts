import { ObjectType, Field } from '@nestjs/graphql';

export interface PaginationRes<T> {
  items: T[];
  pageInfo: PageInfo;
}

@ObjectType('PageInfo')
export class PageInfo {
  @Field()
  hasNext?: boolean;

  @Field()
  hasBefore?: boolean;

  @Field()
  page?: number;

  @Field()
  totalCount?: number;

  @Field()
  totalPages?: number;

  @Field()
  limit?: number;
}
