import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IrrigationSchedule } from './irrigation.entity';
import { CreateIrrigationScheduleDto } from './dto/create-irrigation-schedule.dto';
import { User } from '../users/user.entity';

@Injectable()
export class IrrigationService {
  constructor(
    @InjectRepository(IrrigationSchedule)
    private irrigationScheduleRepository: Repository<IrrigationSchedule>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createIrrigationScheduleDto: CreateIrrigationScheduleDto,
    userId: number,
  ): Promise<IrrigationSchedule[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Remove all existing schedules for this user
    await this.irrigationScheduleRepository.delete({ user: { id: userId } });

    const schedules = createIrrigationScheduleDto.schedules.map((schedule) => {
      const newSchedule = new IrrigationSchedule();
      newSchedule.dayOfWeek = schedule.dayOfWeek;
      newSchedule.startTime = schedule.startTime;
      newSchedule.duration = schedule.duration;
      newSchedule.user = user;
      return newSchedule;
    });

    return this.irrigationScheduleRepository.save(schedules);
  }

  findAll(userId: number): Promise<IrrigationSchedule[]> {
    return this.irrigationScheduleRepository.find({
      where: { user: { id: userId } },
    });
  }
}
