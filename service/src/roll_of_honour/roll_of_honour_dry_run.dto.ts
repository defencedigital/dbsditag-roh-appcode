import {
  IsOptional,
  IsString,
  IsIn,
  IsNumberString,
  IsNumber,
  IsUUID,
  Matches,
} from 'class-validator';
import { createDTOErrorMessage } from '../utils/utils';
import { IsPositiveNumberString } from 'src/dto/validators/isPositiveNumber';
import { ConfigService } from 'src/services/config.service';

const dateFormatRegex =
  /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

export class RollOfHonourDryRunDTO {
  // @IsUUID(4, {
  //   message: createDTOErrorMessage(ConfigService.ID, 'uuid'),
  // })
  // id: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 0,
    },
    {
      message: createDTOErrorMessage(ConfigService.PKID, 'number'),
    },
  )
  @IsOptional()
  pkid?: number | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.SERIAL_NO, 'string'),
  })
  @IsOptional()
  serial_no?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.SURNAME, 'string'),
  })
  @IsOptional()
  surname?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.FORENAMES, 'string'),
  })
  @IsOptional()
  forenames?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.DECORATIONS, 'string'),
  })
  @IsOptional()
  decorations?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.RANK, 'string'),
  })
  @IsOptional()
  rank?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.SERVICE_NO, 'string'),
  })
  // @IsNumberString({ no_symbols: true })
  @IsOptional()
  service_no?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.REGT_CORPS, 'string'),
  })
  @IsOptional()
  regt_corps?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.BIRTH_DATE, 'string'),
  })
  @IsOptional()
  @Matches(dateFormatRegex, {
    message: `${ConfigService.BIRTH_DATE} must be a string in the format dd/mm/yyy`,
  })
  birth_date?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.GENDER, 'string'),
  })
  gender?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.SERVICE, 'string'),
  })
  @IsOptional()
  service?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.MEMORIAL, 'string'),
  })
  @IsOptional()
  memorial?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.NOM_ROLL, 'string'),
  })
  @IsIn(ConfigService.YES_OR_NO, {
    message: `${ConfigService.NOM_ROLL} can only be ${ConfigService.YES} or ${ConfigService.NO}`,
  })
  @IsOptional()
  nom_roll?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.AGE, 'string'),
  })
  @IsNumberString({ no_symbols: true })
  @IsPositiveNumberString({ message: 'Age must be a positive number ' })
  @IsOptional()
  age?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.DEATH_DATE, 'string'),
  })
  @Matches(dateFormatRegex, {
    message: `${ConfigService.DEATH_DATE} must be a string in the format dd/mm/yyy`,
  })
  @IsOptional()
  death_date?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.CEMETARY_NAME, 'string'),
  })
  @IsOptional()
  cemetery_name?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.CEMETARY_ADDRESS_1, 'string'),
  })
  @IsOptional()
  cemetery_address_1?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.CEMETARY_ADDRESS_2, 'string'),
  })
  @IsOptional()
  cemetery_address_2?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.CEMETARY_ADDRESS_3, 'string'),
  })
  @IsOptional()
  cemetery_address_3?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.CEMETARY_ADDRESS_4, 'string'),
  })
  @IsOptional()
  cemetery_address_4?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.CEMETARY_POSTCODE, 'string'),
  })
  @IsOptional()
  cemetery_postcode?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.GRAVE_SECTION, 'string'),
  })
  @IsOptional()
  grave_section?: string | null;

  @IsString({
    message: createDTOErrorMessage(ConfigService.GRAVE_NUMBER, 'string'),
  })
  @IsOptional()
  grave_number?: string | null;

  @IsString({
    message: createDTOErrorMessage(
      ConfigService.HEADSTONE_INSCRIPTION,
      'string',
    ),
  })
  @IsOptional()
  headstone_inscription?: string | null;
}

export default RollOfHonourDryRunDTO;
