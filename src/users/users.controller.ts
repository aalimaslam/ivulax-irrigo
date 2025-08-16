import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FarmerGuard } from '../auth/guards/farmer.guard';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { AssignSubscriptionDto } from './dto/assign-subscription.dto';
import { RequestWithUser } from '../core/types/request-with-user.type';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSubscriptionsService: UserSubscriptionsService,
  ) {}

  // Admin-only endpoints
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/assign-subscription')
  @ApiOperation({ summary: 'Assign a subscription to a user' })
  assignSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignSubscriptionDto: AssignSubscriptionDto,
  ) {
    return this.userSubscriptionsService.assignSubscription(
      id,
      assignSubscriptionDto.subscriptionId,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUserWithEmailPassword(createUserDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }

  // Farmer profile update endpoint
  @UseGuards(JwtAuthGuard, FarmerGuard)
  @Patch('profile')
  @ApiOperation({ summary: 'Update farmer profile' })
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.update(req.user.id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}