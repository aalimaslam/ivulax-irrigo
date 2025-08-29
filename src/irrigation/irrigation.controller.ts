import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { IrrigationService } from './irrigation.service';
import { CreateIrrigationScheduleDto } from './dto/create-irrigation-schedule.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../core/types/request-with-user.type';

@ApiTags('irrigation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('irrigation')
export class IrrigationController {
  constructor(private readonly irrigationService: IrrigationService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update irrigation schedules for a user' })
  @ApiResponse({
    status: 201,
    description: 'The schedules have been successfully created or updated.',
  })
  create(
    @Body() createIrrigationScheduleDto: CreateIrrigationScheduleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.irrigationService.create(
      createIrrigationScheduleDto,
      req.user.id,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all irrigation schedules for a user' })
  @ApiResponse({
    status: 200,
    description: 'Return all irrigation schedules.',
  })
  findAll(@Req() req: RequestWithUser) {
    return this.irrigationService.findAll(req.user.id);
  }
}
