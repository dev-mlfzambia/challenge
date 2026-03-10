import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupEntity } from './entities/group.entity';
import { ClientEntity } from '../client/entities/client.entity';
import { Center } from '../center/entities/center.entity';
import { StatusService } from '../status/status.service';

const mockGroupRepository = {
  createQueryBuilder: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
};
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
  findByName: jest.fn().mockResolvedValue({ id: 's1', name: 'Active' }),
};

describe('GroupController', () => {
  let controller: GroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        GroupService,
        {
          provide: getRepositoryToken(GroupEntity),
          useValue: mockGroupRepository,
        },
        { provide: getRepositoryToken(ClientEntity), useValue: {} },
        { provide: getRepositoryToken(Center), useValue: {} },
        { provide: DataSource, useValue: mockDataSource },
        { provide: StatusService, useValue: mockStatusService },
      ],
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
