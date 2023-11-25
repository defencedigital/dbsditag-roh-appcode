import { IsIn, IsNotEmpty } from 'class-validator';
import { ConfigService } from '../services';

export class ServiceDTO {
  @IsIn(ConfigService.OPTIONS_SERVICE_BRANCHES.map((opt) => opt.value), {
    message: `Service must be a valid service type`,
    each: true,
  })
  @IsNotEmpty({
    message: `Service must be provided`,
  })
  service: string[];
}

export default ServiceDTO;
