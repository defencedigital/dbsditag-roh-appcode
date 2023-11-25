import { Module } from '@nestjs/common';
import { ModloginController } from './modlogin.controller';
import { ModLoginService } from './modlogin.service';
import { AppService } from 'src/app.service';
import { ApplicationService } from 'src/services';

@Module({
  imports: [],
  controllers: [ModloginController],
  providers: [ModLoginService, AppService, ApplicationService],
})
export class ModLoginModule { }
