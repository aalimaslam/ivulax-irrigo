import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

@Entity()
export class IrrigationSchedule {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  @ApiProperty({ enum: DayOfWeek, enumName: 'DayOfWeek' })
  dayOfWeek: DayOfWeek;

  @Column({ type: 'time' })
  @ApiProperty({ example: '09:30' })
  startTime: string;

  @Column()
  @ApiProperty({ description: 'Duration of the irrigation in minutes' })
  duration: number; // in minutes

  @ManyToOne(() => User, (user) => user.irrigationSchedules)
  user: User;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty()
  deletedAt: Date;
}
