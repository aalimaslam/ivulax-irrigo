import { Test, TestingModule } from '@nestjs/testing';
import { IrrigationTaskService } from './irrigation-task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IrrigationSchedule, DayOfWeek } from '../irrigation/irrigation.entity';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { User } from '../users/user.entity';

describe('IrrigationTaskService', () => {
  let service: IrrigationTaskService;
  let httpService: HttpService;
  let irrigationScheduleRepository: any;

  const mockIrrigationScheduleRepository = {
    find: jest.fn(),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IrrigationTaskService,
        {
          provide: getRepositoryToken(IrrigationSchedule),
          useValue: mockIrrigationScheduleRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<IrrigationTaskService>(IrrigationTaskService);
    httpService = module.get<HttpService>(HttpService);
    irrigationScheduleRepository = module.get(
      getRepositoryToken(IrrigationSchedule),
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleCron', () => {
    it('should trigger irrigation for due schedules', async () => {
      const user = new User();
      user.id = 1;
      user.deviceUrl = 'http://test.com/device';

      const schedule = new IrrigationSchedule();
      schedule.id = '1';
      schedule.dayOfWeek = DayOfWeek.MONDAY;
      schedule.startTime = '10:00';
      schedule.duration = 30;
      schedule.user = user;

      mockIrrigationScheduleRepository.find.mockResolvedValue([schedule]);
      mockHttpService.post.mockReturnValue(of({}));

      // Mock the current time to be Monday 10:00
      jest.useFakeTimers().setSystemTime(new Date('2024-01-01T10:00:00Z'));

      await service.handleCron();

      expect(irrigationScheduleRepository.find).toHaveBeenCalled();
      expect(httpService.post).toHaveBeenCalledWith(user.deviceUrl, {
        duration: schedule.duration,
      });
    });
  });
});
