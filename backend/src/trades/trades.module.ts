import { Module, HttpModule } from '@nestjs/common';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { DatabaseModule } from '../database/database.module'
import { UtilsModule } from '../utils/utils.module'

@Module({
  imports: [HttpModule, DatabaseModule, UtilsModule],
  controllers: [TradesController],
  providers: [TradesService],
  exports: [TradesService]
})
export class TradesModule {}
