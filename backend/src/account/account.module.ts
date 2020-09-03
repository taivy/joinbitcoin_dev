import { Module, HttpModule } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { DatabaseModule } from '../database/database.module'
import { UtilsModule } from '../utils/utils.module'

@Module({
  imports: [HttpModule, DatabaseModule, UtilsModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
