import { registerDecorator } from 'class-validator';
import { permissions } from 'src/security-group/security-group-permissions';

export function ValidPermissions() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidPermissions',
      propertyName,
      target: object.constructor,
      options: { message: 'Invalid permission name' },
      validator: {
        validate(value: string[]) {
          return validPermissions(value);
        },
      },
    });
  };
}

function validPermissions(value: string[]) {
  return value.every((val) =>
    Object.values(permissions).find((arr) => arr.includes(val)),
  );
}
