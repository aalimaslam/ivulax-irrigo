import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IrrigationSchedule, DayOfWeek } from '../irrigation/irrigation.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IrrigationTaskService {
  private readonly logger = new Logger(IrrigationTaskService.name);

  constructor(
    @InjectRepository(IrrigationSchedule)
    private irrigationScheduleRepository: Repository<IrrigationSchedule>,
    private readonly httpService: HttpService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();
    const dayOfWeek = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ][now.getDay()];
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    this.logger.debug(`Checking for schedules at ${dayOfWeek} ${currentTime}`);

    const schedules = await this.irrigationScheduleRepository.find({
      where: {
        dayOfWeek,
        startTime: currentTime,
      },
      relations: ['user'],
    });

    this.logger.debug(`Found ${schedules.length} schedules to run.`);

    for (const schedule of schedules) {
      if (schedule.user && schedule.user.deviceUrl) {
        this.logger.log(
          `Triggering irrigation for user ${schedule.user.id} at ${schedule.user.deviceUrl}`,
        );
        try {
          await firstValueFrom(
            this.httpService.post(schedule.user.deviceUrl, {
              duration: schedule.duration,
            }),
          );
        } catch (error) {
          this.logger.error(
            `Failed to trigger irrigation for user ${schedule.user.id}`,
            error.stack,
          );
        }
      }
    }
  }
}
