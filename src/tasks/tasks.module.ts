import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { IrrigationModule } from '../irrigation/irrigation.module';
import { IrrigationTaskService } from './irrigation-task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrrigationSchedule } from '../irrigation/irrigation.entity';
import { HttpModule } from '@nestjs/axios';
import { User } from '../users/user.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([IrrigationSchedule, User]),
    HttpModule,
  ],
  providers: [IrrigationTaskService],
})
export class TasksModule {}
