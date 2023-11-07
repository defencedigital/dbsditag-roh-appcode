import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsPositiveNumberStringConstraint
  implements ValidatorConstraintInterface
{
  validate(num: any) {
    if (num?.trim() === '') {
      return true;
    }
    const dayInteger = parseInt(num, 10);
    return dayInteger > 0;
  }
}

export function IsPositiveNumberString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPositiveNumberStringConstraint,
    });
  };
}
