import { IsOptional, IsString, IsIn } from 'class-validator';
import BaseDto from './baseDto';

class TransferDataDto extends BaseDto {
    @IsOptional()
    @IsIn(['Yes', 'yes'])
    @IsString()
    ['keep-all']?: string;

}

export default TransferDataDto;