import { Test, TestingModule } from '@nestjs/testing';
import { GraphDbController } from './graph-db.controller';

describe('GraphDbController', () => {
  let controller: GraphDbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphDbController],
    }).compile();

    controller = module.get<GraphDbController>(GraphDbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
