import { Controller, Get, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'Return all transactions.' })
  findAll() {
    return this.transactionsService.findAll();
  }
}
