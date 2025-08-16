import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('create-order')
  @ApiOperation({ summary: 'Create a Razorpay order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })

  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.paymentsService.createOrder(
      createOrderDto.subscriptionId,
      req.user.userId,
    );
  }



  @Post('verify')
  @ApiOperation({ summary: 'Verify a Razorpay payment' })
  @ApiResponse({
    status: 200,
    description: 'The payment has been successfully verified.',
  })
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(
      verifyPaymentDto.razorpayOrderId,
      verifyPaymentDto.razorpayPaymentId,
      verifyPaymentDto.razorpaySignature,
    );
  }
}
