import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { MyModelStatic } from '../database/database.static-model';

export function UniqueSlug(
  model: MyModelStatic,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Unique',
      propertyName,
      target: object.constructor,
      constraints: [model],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const [model] = args.constraints;
          return await slugHasToBeUnique(value, model);
        },
      },
    });
  };
}

async function slugHasToBeUnique(
  slug: any,
  model: MyModelStatic,
): Promise<boolean> {
  const item = await model.findOne({ where: { slug } });
  return item ? false : true;
}
