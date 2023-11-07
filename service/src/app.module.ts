import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationService, ConfigService } from './services';
import { SessionProvider } from './providers/session.provider';
import { Pathway } from './middleware/pathway.middleware';
import { LocalsPropertyMiddleware } from './middleware/locals-property.service';
import { ServiceController } from './routes/service/service.controller';
import { DetailsController } from './routes/details/details.controller';
import { RollOfHonourModule } from './roll_of_honour/roll_of_honour.module';
import { ResultsModule } from './routes/results/results.module';
import { ServicepersonModule } from './routes/serviceperson/serviceperson.module';
import { SearchAgainModule } from './routes/search-again/search-again.module';
import { AccessibilityStatementModule } from './routes/accessibility-statement/accessibility-statement.module';
import { CookiePolicyModule } from './routes/cookie-policy/cookie-policy.module';
import { PrivacyPolicyModule } from './routes/privacy-policy/privacy-policy.module';
import { FeedbackModule } from './routes/feedback/feedback.module';
import { UpdateModule } from 'src/routes/update-data/update.module';
import { rollOfHonourProviders } from './roll_of_honour/roll_of_honour.providers';
import { RollOfHonourService } from './roll_of_honour/roll_of_honour.service';
import { ModLoginModule } from './routes/modlogin/modlogin.module';
import { ModloginController } from './routes/modlogin/modlogin.controller';
import { ModLoginService } from './routes/modlogin/modlogin.service';

@Module({
  imports: [
    RollOfHonourModule,
    ResultsModule,
    ServicepersonModule,
    SearchAgainModule,
    AccessibilityStatementModule,
    CookiePolicyModule,
    PrivacyPolicyModule,
    FeedbackModule,
    UpdateModule,
  ],
  controllers: [
    AppController,
    ServiceController,
    DetailsController,
    ModloginController,
  ],
  providers: [
    AppService,
    ConfigService,
    ApplicationService,
    SessionProvider,
    ModLoginService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LocalsPropertyMiddleware).forRoutes('/*');
    consumer.apply(Pathway).forRoutes('/*');
  }
}
