import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduledJobService {
    private readonly logger = new Logger(ScheduledJobService.name);

    @Cron(CronExpression.EVERY_2_HOURS)
    async graphTuning() {
        this.logger.log('Running graphTuning Job');
    }
}
