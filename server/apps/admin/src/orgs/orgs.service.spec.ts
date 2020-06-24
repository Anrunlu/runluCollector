import { Test, TestingModule } from '@nestjs/testing';
import { OrgsService } from './orgs.service';

describe('OrgsService', () => {
  let service: OrgsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgsService],
    }).compile();

    service = module.get<OrgsService>(OrgsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
