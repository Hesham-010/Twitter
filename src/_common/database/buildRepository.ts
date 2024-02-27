import { Global, Injectable } from '@nestjs/common';
import { MyModel, MyModelStatic } from './database.static-model';
import { IRepository } from './buildRepository.interface';
import { Includeable, Transaction, WhereOptions } from 'sequelize';
import { PaginationRes } from '../pagination/pagination.type';

export function buildRepository(Model: MyModelStatic) {
  @Global()
  @Injectable()
  class RepositoryBuilder implements IRepository<MyModel> {
    async findOne(
      where: WhereOptions = {},
      include: Includeable[] = [],
      attributes?: string[],
    ): Promise<MyModel> {
      return await Model.findOne({
        where,
        include,
        ...(attributes && { attributes }),
      });
    }

    async findAll(
      where: WhereOptions = {},
      include: Includeable[] = [],
      sort = '-createdAt',
      attributes?: string[],
    ): Promise<MyModel[]> {
      let order = null;
      if (typeof sort === 'object') order = sort;
      else
        order = [
          [sort.replace('-', ''), sort.startsWith('-') ? 'DESC' : 'ASC'],
        ];
      return await Model.findAll({
        where,
        include,
        ...(order && { order }),
        ...(attributes && { attributes }),
      });
    }

    async findPaginated(
      where: WhereOptions = {},
      sort: any = '-createdAt',
      page: number = 0,
      limit: number = 15,
      include: Includeable[] = [],
    ): Promise<PaginationRes<MyModel>> {
      return await (Model as MyModelStatic & { paginate: any }).paginate(
        where,
        sort,
        page,
        limit,
        include,
      );
    }

    // findPaginatedManually() {
    //   throw new Error('Method not implemented.');
    // }

    // sumFields() {
    //   throw new Error('Method not implemented.');
    // }

    async createOne(input: any, transaction?: Transaction): Promise<MyModel> {
      return await Model.create(input, { ...(transaction && { transaction }) });
    }

    async bulkCreate(models: Array<any>): Promise<MyModel[]> {
      return await Model.bulkCreate(models);
    }

    async findOrCreate(
      where: WhereOptions = {},
      input: any = {},
    ): Promise<MyModel> {
      let item = await Model.findOne({ where });
      if (!item) item = await Model.create(input);
      return item;
    }

    async updateOneFromExistingModel(
      model: MyModel,
      input: object,
      transaction?: Transaction,
    ): Promise<MyModel> {
      const item = await model.update({ ...input }, { transaction });
      return item;
    }

    async updateAll(
      where: WhereOptions = {},
      input: object = {},
      transaction?: Transaction,
    ): Promise<MyModel[]> {
      const res = await Model.update(input, {
        returning: true,
        where,
        ...(transaction && { transaction }),
      });
      return res[1];
    }

    async deleteAll(
      where: WhereOptions,
      transaction?: Transaction,
    ): Promise<number> {
      return await Model.destroy({
        where,
        ...(transaction && { transaction }),
      });
    }

    async truncateModel(): Promise<void> {
      return await Model.truncate({ force: true, cascade: true });
    }
  }

  return RepositoryBuilder;
}
