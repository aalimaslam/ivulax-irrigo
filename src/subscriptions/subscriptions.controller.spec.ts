import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserRole } from '../users/user.entity';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let service: SubscriptionsService;

  const mockSubscriptionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { id: 1, role: UserRole.FARMER };
  const mockAdmin = { id: 2, role: UserRole.ADMIN };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: SubscriptionsService,
          useValue: mockSubscriptionsService,
        },
      ],
    }).compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call the service to find all subscriptions', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should not be accessible by a non-admin user', async () => {
        const canActivate = new AdminGuard().canActivate({
            switchToHttp: () => ({
                getRequest: () => ({
                    user: mockUser
                })
            })
        } as any);
        expect(canActivate).toBe(false);
    });

    it('should be accessible by an admin user', async () => {
        const canActivate = new AdminGuard().canActivate({
            switchToHttp: () => ({
                getRequest: () => ({
                    user: mockAdmin
                })
            })
        } as any);
        expect(canActivate).toBe(true);
    });
  });
});
