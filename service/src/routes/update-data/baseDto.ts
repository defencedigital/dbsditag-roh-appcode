import { IsNotEmpty, IsString } from 'class-validator';

class BaseDto {
  @IsNotEmpty({ message: 'csrf is required' })
  @IsString({ message: 'isRequired format' })
  _csrf: string;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

export default BaseDto;
