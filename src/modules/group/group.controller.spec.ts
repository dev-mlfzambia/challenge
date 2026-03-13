/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupResponseDto } from './dto/group-response.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';

// ─Mock data

const mockOffice = { id: 'office-1', name: 'Nairobi Office' };

const mockUser = {
  id: 'user-1',
  role: 'loan_officer',
  office: mockOffice,
};

const mockGroup = {
  id: 'group-1',
  name: 'Test Group',
  systemName: 'CTR1',
  officeName: 'Nairobi Office',
  active: true,
  status: { id: 'status-1', name: 'Active' },
  center: {
    id: 'center-1',
    name: 'Test Center',
    meetingDates: { week: 1, day: 'Monday' },
  },
  staff: {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    office: mockOffice,
  },
  clients: [],
  groupLeader: { id: 'client-1' },
};

// ─Mock service — replaces real GroupService (no DB needed)

const mockGroupService = {
  findOne: jest.fn().mockResolvedValue(mockGroup),
  create: jest.fn(),
  getGroups: jest.fn(),
  getGroupsByCenter: jest.fn(),
  findAllSummary: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  activate: jest.fn(),
  deactivate: jest.fn(),
  addClientsToGroup: jest.fn(),
  updateSystemName: jest.fn(),
};

// ─Suite //

describe('GroupController', () => {
  let controller: GroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        {
          provide: GroupService, // ← provide TOKEN
          useValue: mockGroupService, // ← but inject mock, not real service
        },
      ],
    })
      .overrideGuard(AuthGuard()) // ← skip real JWT auth
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard) // ← skip real role check
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<GroupController>(GroupController);
  });

  afterEach(() => jest.clearAllMocks());

  // ── Sanity

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ── findOne

  describe('findOne', () => {
    it('should return a GroupResponseDto containing officeName', async () => {
      const req = { user: mockUser };

      const result = await controller.findOne('group-1', req as any);

      expect(result).toBeInstanceOf(GroupResponseDto);
      expect(result.data.officeName).toBe('Nairobi Office');
    });

    it('should call groupService.findOne with correct id and user', async () => {
      const req = { user: mockUser };

      await controller.findOne('group-1', req as any);

      expect(mockGroupService.findOne).toHaveBeenCalledTimes(1);
      expect(mockGroupService.findOne).toHaveBeenCalledWith(
        'group-1',
        mockUser,
      );
    });
  });
});
