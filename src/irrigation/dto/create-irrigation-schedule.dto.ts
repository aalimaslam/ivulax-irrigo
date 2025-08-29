import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { DayOfWeek } from '../irrigation.entity';

export class ScheduleItemDto {
  @ApiProperty({ enum: DayOfWeek, enumName: 'DayOfWeek' })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  dayOfWeek: DayOfWeek;

  @ApiProperty({ example: '09:30' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  startTime: string;

  @ApiProperty({ description: 'Duration of the irrigation in minutes' })
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}

export class CreateIrrigationScheduleDto {
  @ApiProperty({ type: [ScheduleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  schedules: ScheduleItemDto[];
}
