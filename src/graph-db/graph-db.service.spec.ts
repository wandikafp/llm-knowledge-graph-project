import { Test, TestingModule } from '@nestjs/testing';
import { GraphDbService } from './graph-db.service';

describe('GraphDbService', () => {
  let service: GraphDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphDbService],
    }).compile();

    service = module.get<GraphDbService>(GraphDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
