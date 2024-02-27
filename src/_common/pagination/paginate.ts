import { PaginationRes } from './pagination.type';
import { MyModelStatic } from '../database/database.static-model';
import { Literal } from 'sequelize/types/utils';

// export async function paginate<T>(
//   model: ModelCtor,
//   page = 1,
//   limit = 10,
// ): Promise<PaginationResponse<T>> {
//   const totalCount: number = await model.count();

//   if (limit > 10) limit = 10;
//   if (limit < 1) limit = 10;
//   if (page < 1) page = 1;

//   const totalPages = Math.ceil(totalCount / limit) || 1;
//   const offset = page > 1 ? (page - 1) * limit : 0;
//   const hasNext: boolean = offset + limit < totalCount;
//   const hasBefore: boolean = page <= 1 ? false : true;

//   const items = await model.findAll({
//     limit,
//     offset,
//   });

//   return {
//     pageInfo: {
//       hasBefore,
//       hasNext,
//       page,
//       totalCount,
//       totalPages,
//       limit,
//     },
//     items: <any>items,
//   };
// }

export const paginate = async <T>(
  model: MyModelStatic,
  page: number = 1,
  limit: number = 15,
  filter = {},
  sort: string | Literal = '-createdAt',
  include: any = [],
): Promise<PaginationRes<T>> => {
  const totalCount = (await model.findAll({ where: filter, include })).length;
  const totalPages = totalCount / limit < 1 ? 1 : Math.ceil(totalCount / limit);
  if (limit > 50) limit = 50;
  if (limit < 0) limit = 15;
  if (page < 0) page = 0;

  const offset = page > 1 ? (page - 1) * limit : 0;
  const hasNext = page < totalPages ? true : false;
  const hasBefore = page <= 1 ? false : true;

  let order;
  if (typeof sort === 'object') order = sort;
  else order = [[sort.replace('-', ''), sort.startsWith('-') ? 'DESC' : 'ASC']];

  const items = model.findAll({
    where: filter,
    ...order,
    limit,
    offset,
    include,
  });

  return {
    items: <any>items,
    pageInfo: {
      page,
      hasNext,
      hasBefore,
    },
  };
};
