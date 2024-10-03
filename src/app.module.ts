import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { LlmService } from './llm/llm.service';
import { LlmController } from './llm/llm.controller';
import { GraphDbService } from './graph-db/graph-db.service';
import { GraphDbController } from './graph-db/graph-db.controller';
import { ScheduledJobService } from './scheduled-job/scheduled-job.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [LlmController, GraphDbController],
  providers: [LlmService, GraphDbService, ScheduledJobService],
})
export class AppModule {}
