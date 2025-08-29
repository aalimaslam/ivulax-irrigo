import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrrigationSchedule } from './irrigation.entity';
import { IrrigationController } from './irrigation.controller';
import { IrrigationService } from './irrigation.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IrrigationSchedule, User])],
  controllers: [IrrigationController],
  providers: [IrrigationService],
})
export class IrrigationModule {}
