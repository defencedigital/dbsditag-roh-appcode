import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DetailsDTO {
  @IsOptional()
  @IsString({
    message: `firstname must be text`,
  })
  firstname: string;

  @IsNotEmpty({
    message: `surname must be provided`,
  })
  surname: string;

  @IsOptional()
  @IsString({
    message: `service number must be a valid service number`,
  })
  service_number: string;
}

export default DetailsDTO;
