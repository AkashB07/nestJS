import { Test, TestingModule } from '@nestjs/testing';
import { ListManagementController } from './list-management.controller';
import { ListGroupsService } from './services/list-groups.service';

describe('ListManagementController', () => {
  let controller: ListManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListManagementController],
      providers: [ListGroupsService],
    }).compile();

    controller = module.get<ListManagementController>(ListManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
