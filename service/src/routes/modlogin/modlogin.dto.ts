import {
  IsEmail,
  IsNotEmpty,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsModGovUkEmailConstraint implements ValidatorConstraintInterface {
  validate(email: string, args: ValidationArguments) {
    if (!email) return false; // Return false if email is not provided or undefined
    return email.endsWith('mod.gov.uk'); // Ensures email ends with "mod.gov.uk"
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email must end with "mod.gov.uk"';
  }
}

/** Create a DTO for the login route */
class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Validate(IsModGovUkEmailConstraint, {
    message: 'Email must end with "mod.gov.uk"',
  })
  email: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export default LoginDto;
