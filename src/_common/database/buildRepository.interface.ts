import { Includeable, Transaction, WhereOptions } from 'sequelize';
import { PaginationRes } from '../pagination/pagination.type';

export interface IRepository<T> {
  findOne(
    where: WhereOptions,
    include?: Includeable[],
    attributes?: string[],
  ): Promise<T>;

  findAll(
    where?: WhereOptions,
    include?: Includeable[],
    sort?: any,
    attributes?: string[],
  ): Promise<T[]>;

  findPaginated(
    where: WhereOptions,
    sort: any,
    page: number,
    limit: number,
    include?: Includeable[],
  ): Promise<PaginationRes<T>>;

  // findPaginatedManually();
  // sumFields();

  createOne(input: any, transaction?: Transaction): Promise<T>;

  bulkCreate(items: Array<Object>): Promise<T[]>;

  findOrCreate(where: WhereOptions, input: object): Promise<T>;

  updateOneFromExistingModel(
    model: T,
    input: object,
    transaction?: Transaction,
  ): Promise<T>;

  updateAll(
    where: WhereOptions,
    input: object,
    transaction?: Transaction,
  ): Promise<T[]>;

  deleteAll(where: WhereOptions, transaction?: Transaction): Promise<number>;

  truncateModel(): Promise<void>;
}
