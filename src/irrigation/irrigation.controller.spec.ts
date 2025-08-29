import { Test, TestingModule } from '@nestjs/testing';
import { IrrigationController } from './irrigation.controller';
import { IrrigationService } from './irrigation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DayOfWeek } from './irrigation.entity';
import { CreateIrrigationScheduleDto } from './dto/create-irrigation-schedule.dto';

describe('IrrigationController', () => {
  let controller: IrrigationController;
  let service: IrrigationService;

  const mockIrrigationService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IrrigationController],
      providers: [
        {
          provide: IrrigationService,
          useValue: mockIrrigationService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock the guard
      .compile();

    controller = module.get<IrrigationController>(IrrigationController);
    service = module.get<IrrigationService>(IrrigationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service to create a schedule', async () => {
      const dto: CreateIrrigationScheduleDto = {
        schedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            startTime: '09:00',
            duration: 30,
          },
        ],
      };
      const req = { user: { id: 1 } };

      await controller.create(dto, req as any);

      expect(service.create).toHaveBeenCalledWith(dto, req.user.id);
    });
  });

  describe('findAll', () => {
    it('should call the service to find all schedules for a user', async () => {
      const req = { user: { id: 1 } };

      await controller.findAll(req as any);

      expect(service.findAll).toHaveBeenCalledWith(req.user.id);
    });
  });
});
