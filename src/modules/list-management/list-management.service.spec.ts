import { Test, TestingModule } from '@nestjs/testing';
import { ListGroupsService } from './services/list-groups.service';

describe('ListGroupsService', () => {
  let service: ListGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListGroupsService],
    }).compile();

    service = module.get<ListGroupsService>(ListGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
