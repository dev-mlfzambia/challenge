import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GroupService } from './group.service';
import { GroupEntity } from './entities/group.entity';
import { ClientEntity } from '../client/entities/client.entity';
import { Center } from '../center/entities/center.entity';
import { StatusService } from '../status/status.service';
import { RoleType } from '../../constants/role-type';
import { Order } from '../../constants';

const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
};

const mockGroupRepository = {
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

const mockClientRepository = {};
const mockCenterRepository = {};
const mockDataSource = {
  transaction: jest.fn((cb) =>
    cb({
      getRepository: jest.fn(() => ({
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
      })),
    }),
  ),
};
const mockStatusService = {
  findByName: jest.fn().mockResolvedValue({ id: 'status-id', name: 'Active' }),
};

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
    mockQueryBuilder.getOne.mockResolvedValue(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getRepositoryToken(GroupEntity),
          useValue: mockGroupRepository,
        },
        {
          provide: getRepositoryToken(ClientEntity),
          useValue: mockClientRepository,
        },
        { provide: getRepositoryToken(Center), useValue: mockCenterRepository },
        { provide: DataSource, useValue: mockDataSource },
        { provide: StatusService, useValue: mockStatusService },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addTimelineEvent', () => {
    it('should add a timeline event correctly', () => {
      const mockUser = {
        id: 'user-id',
        firstName: 'John',
        lastName: 'Doe',
      };

      const existingTimeline = {
        events: [
          {
            action: 'group_created',
            description: 'Group was created',
            userId: 'user-id',
            userName: 'John Doe',
            datetime: '2024-01-01T00:00:00.000Z',
            details: {},
          },
        ],
      };

      const result = (service as any).addTimelineEvent(
        existingTimeline,
        'test_action',
        'Test description',
        mockUser,
        { testDetail: 'value' },
      );

      expect(result.events).toHaveLength(2);
      expect(result.events[1].action).toBe('test_action');
      expect(result.events[1].description).toBe('Test description');
      expect(result.events[1].userId).toBe('user-id');
      expect(result.events[1].userName).toBe('John Doe');
      expect(result.events[1].details.testDetail).toBe('value');
    });

    it('should handle empty timeline', () => {
      const mockUser = {
        id: 'user-id',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = (service as any).addTimelineEvent(
        null,
        'test_action',
        'Test description',
        mockUser,
        { testDetail: 'value' },
      );

      expect(result.events).toHaveLength(1);
      expect(result.events[0].action).toBe('test_action');
    });
  });

  describe('findOne (README: group endpoint must include officeName)', () => {
    it('returns group with officeName in the result', async () => {
      const groupId = 'group-id-1';
      const mockGroup = {
        id: groupId,
        name: 'Test Group',
        systemName: 'TG1',
        officeName: 'Main Office',
        active: true,
        staff: { id: 'user-1', firstName: 'John', lastName: 'Doe' },
        groupLeader: { id: 'leader-1' },
        center: {
          id: 'center-1',
          name: 'Center 1',
          centerCode: 'C1',
          meetingTime: null,
          meetingDates: null,
        },
        clients: [],
      };
      mockQueryBuilder.getOne.mockResolvedValueOnce(mockGroup);

      const mockUser = {
        id: 'user-1',
        role: RoleType.LOAN_OFFICER,
        office: { name: 'Main Office' },
      } as any;

      const result = await service.findOne(groupId, mockUser);

      expect(result).toBeDefined();
      expect(result.officeName).toBe('Main Office');
    });
  });

  describe('getGroups (README: status filter must be applied)', () => {
    it('applies status filter when filters.status is provided', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([[], 0]);
      const mockUser = {
        id: 'user-1',
        role: RoleType.LOAN_OFFICER,
        office: null,
      } as any;
      const pageOptionsDto = {
        page: 1,
        limit: 10,
        skip: 0,
        take: 10,
        order: Order.ASC,
      } as any;

      await service.getGroups({
        user: mockUser,
        filters: { status: 'ACTIVE' },
        pageOptionsDto,
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(status.name) = LOWER(:status)',
        { status: 'ACTIVE' },
      );
    });
  });
});
