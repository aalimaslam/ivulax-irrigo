import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
} from '../transactions/transaction.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UserSubscriptionsService } from '../user-subscriptions/user-subscriptions.service';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;

  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly userSubscriptionsService: UserSubscriptionsService,
    private readonly configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(subscriptionId: string, userId: number) {
    const subscription =
      await this.subscriptionsService.findOne(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const orderOptions = {
      amount: subscription.price * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    try {
      const order = await this.razorpay.orders.create(orderOptions);

      const transaction = this.transactionsRepository.create({
        userId,
        subscriptionId,
        amount: subscription.price,
        currency: order.currency,
        razorpayOrderId: order.id,
        status: TransactionStatus.PENDING,
      });

      await this.transactionsRepository.save(transaction);

      return { ...order, subscription };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    const transaction = await this.transactionsRepository.findOne({
      where: { razorpayOrderId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const hmac = crypto.createHmac(
      'sha256',
      this.configService.get('RAZORPAY_KEY_SECRET'),
    );
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpaySignature) {
      transaction.status = TransactionStatus.FAILED;
      await this.transactionsRepository.save(transaction);
      throw new InternalServerErrorException('Payment verification failed');
    }

    transaction.razorpayPaymentId = razorpayPaymentId;
    transaction.status = TransactionStatus.SUCCESSFUL;
    await this.transactionsRepository.save(transaction);

    await this.userSubscriptionsService.assignSubscription(
      transaction.userId,
      transaction.subscriptionId,
    );

    return { message: 'Payment verified successfully' };
  }
}
