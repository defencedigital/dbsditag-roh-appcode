import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from 'src/services';

@Controller(ConfigService.pathNames.PRIVACY_POLICY)
export class PrivacyPolicyController {
  @Get()
  @Render(`${ConfigService.pathNames.PRIVACY_POLICY}/${ConfigService.INDEX}`)
  index() {
    return { pageName: 'Privacy Policy' };
  }
}
