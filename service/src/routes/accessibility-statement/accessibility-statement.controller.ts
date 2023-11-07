import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from 'src/services';

@Controller(ConfigService.pathNames.ACCESSIBILITY_STATEMENT)
export class AccessibilityStatementController {
  @Get()
  @Render(
    `${ConfigService.pathNames.ACCESSIBILITY_STATEMENT}/${ConfigService.INDEX}`,
  )
  index() {
    return { pageName: 'Accessibility Statement' };
  }
}
