import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserSubscriptionsService } from '../../user-subscriptions/user-subscriptions.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly userSubscriptionsService: UserSubscriptionsService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    return this.userSubscriptionsService.hasActiveSubscription(user.sub);
  }
}
