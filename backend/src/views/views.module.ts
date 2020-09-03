import { Module, HttpModule } from '@nestjs/common';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [ViewsController],
  providers: [ViewsService],
})
export class ViewsModule {}
